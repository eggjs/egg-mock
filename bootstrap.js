'use strict';

const assert = require('power-assert');
const mock = require('./index');

const options = {};
if (process.env.EGG_BASE_DIR) options.baseDir = process.env.EGG_BASE_DIR;
const app = mock.app(options);

before(() => app.ready());
afterEach(mock.restore);

module.exports = {
  assert,
  app,
  mock,
  mm: mock,
};
