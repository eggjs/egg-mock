'use strict';

const assert = require('power-assert');
const mock = require('./index').default;

const options = {};
if (process.env.EGG_BASE_DIR) options.baseDir = process.env.EGG_BASE_DIR;
const app = mock.app(options);

before(() => app.ready());
afterEach(() => app.backgroundTasksFinished());
// restore should be the last one
afterEach(mock.restore);

module.exports = {
  assert,
  app,
  mock,
  mm: mock,
};
