'use strict';

const assert = require('assert');
const path = require('path');
const mock = require('./index').default;
const mockParallelApp = require('./lib/parallel/app');
const { getEggOptions } = require('./lib/utils');

const options = getEggOptions();

// throw error when an egg plugin test is using bootstrap
const pkgInfo = require(path.join(options.baseDir || process.cwd(), 'package.json'));
if (pkgInfo.eggPlugin) throw new Error('DO NOT USE bootstrap to test plugin');

let app;
if (process.env.ENABLE_MOCHA_PARALLEL && process.env.AUTO_AGENT) {
  app = mockParallelApp(options);
} else {
  app = mock.app(options);
  if (typeof beforeAll === 'function') {
    // jest
    beforeAll(() => app.ready());
  } else {
    // mocha
    before(() => app.ready());
  }
  afterEach(() => app.backgroundTasksFinished());
  afterEach(mock.restore);
}

module.exports = {
  assert,
  app,
  mock,
  mm: mock,
};
