'use strict';

const path = require('path');
const fs = require('fs');
const mm = require('..');
const rimraf = require('rimraf');
const assert = require('assert');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/agent.test.js', () => {
  let app;
  afterEach(() => app.close());

  it('mock agent ok', function* () {
    const baseDir = path.join(fixtures, 'agent');
    const filepath = path.join(baseDir, 'run/test.txt');
    rimraf.sync(filepath);

    app = mm.app({
      baseDir,
    });

    yield app.ready();
    assert(fs.readFileSync(filepath, 'utf8') === '123');
  });

  it('mock agent again ok', done => {
    const baseDir = path.join(fixtures, 'agent');

    app = mm.app({
      baseDir,
    });
    app.ready(done);
  });
});
