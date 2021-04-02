'use strict';

const mm = require('..');
const fs = require('fs');
const path = require('path');
const { rimraf } = require('mz-modules');
const assert = require('assert');

const fixtures = path.join(__dirname, 'fixtures');
const baseDir = path.join(fixtures, 'agent');

describe('test/agent.test.js', () => {
  let app;
  afterEach(() => app.close());
  afterEach(mm.restore);

  it('mock agent ok', function* () {
    const filepath = path.join(baseDir, 'run/test.txt');
    rimraf.sync(filepath);

    app = mm.app({
      baseDir,
    });

    yield app.ready();
    assert(fs.readFileSync(filepath, 'utf8') === '123');
  });

  it('mock agent again ok', done => {
    app = mm.app({
      baseDir,
    });
    app.ready(done);
  });

  it('should cluster-client work', done => {
    app = mm.app({ baseDir });
    app.ready(() => {
      app._agent.client.subscribe('agent sub', data => {
        assert(data === 'agent sub');

        app.client.subscribe('app sub', data => {
          assert(data === 'app sub');
          done();
        });
      });
    });
  });

  it('should agent work ok after ready', function* () {
    app = mm.app({ baseDir });
    yield app.ready();
    assert(app._agent.type === 'agent');
  });

  it('should FrameworkErrorformater work during agent boot', function* () {
    let logMsg;
    let catchErr;
    mm(process.stderr, 'write', msg => {
      logMsg = msg;
    });
    app = mm.app({ baseDir: path.join(fixtures, 'agent-boot-error') });
    try {
      yield app.ready();
    } catch (err) {
      catchErr = err;
    }

    assert(catchErr.code === 'customPlugin_99');
    assert(/framework\.CustomError\: mock error \[https\:\/\/eggjs\.org\/zh-cn\/faq\/customPlugin_99\]/.test(logMsg))
  });

  it('should FrameworkErrorformater work during agent boot ready', function* () {
    let logMsg;
    let catchErr;
    mm(process.stderr, 'write', msg => {
      logMsg = msg;
    });
    app = mm.app({ baseDir: path.join(fixtures, 'agent-boot-ready-error') });
    try {
      yield app.ready();
    } catch (err) {
      catchErr = err;
    }

    assert(catchErr.code === 'customPlugin_99');
    assert(/framework\.CustomError\: mock error \[https\:\/\/eggjs\.org\/zh-cn\/faq\/customPlugin_99\]/.test(logMsg))
  });
});
