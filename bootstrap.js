'use strict';

const assert = require('power-assert');
const mm = require('./index');

const options = {};
if (process.env.EGG_BASE_DIR) options.baseDir = process.env.EGG_BASE_DIR;
const app = mm.app(options);

before(() => app.ready());
afterEach(mm.restore);

module.exports = {
  assert,
  app,
  mm,
};
