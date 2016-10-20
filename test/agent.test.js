'use strict';

const path = require('path');
const fs = require('fs');
const mm = require('..');
const rimraf = require('rimraf');
const assert = require('power-assert');


const fixtures = path.join(__dirname, 'fixtures');

describe('test/agent.test.js', () => {

  it('mock agent ok', function* () {
    const baseDir = path.join(fixtures, 'agent');
    const filepath = path.join(baseDir, 'run/test.txt');
    rimraf.sync(filepath);

    const app = mm.app({
      baseDir,
    });

    yield app.ready();
    assert(fs.readFileSync(filepath, 'utf8') === '123');
  });

  it('mock agent again ok', done => {
    const baseDir = path.join(fixtures, 'agent');

    const app = mm.app({
      baseDir,
    });
    app.ready(done);
  });
});
