'use strict';

const path = require('path');
const baseDir = process.env.EGG_BASE_DIR = path.join(__dirname, './fixtures/app');
const { app, assert, mm } = require('../bootstrap');

describe('test/bootstrap.test.js', () => {
  it('should create app success', () => {
    assert(app.baseDir === baseDir);
    mm(app, 'baseDir', 'foo');
    assert(app.baseDir === 'foo');
  });

  it('should afterEach(mm.restore) success', () => {
    assert(app.baseDir === baseDir);
  });

  it('should assert success', done => {
    try {
      assert(app.baseDir !== baseDir);
    } catch (err) {
      done();
    }
  });
});
