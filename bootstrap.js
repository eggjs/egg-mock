const debug = require('util').debuglog('egg-mock:bootstrap');
const assert = require('assert');
const path = require('path');
const mock = require('./index').default;
const { setupAgent } = require('./lib/agent');
const mockParallelApp = require('./lib/parallel/app');
const { getEggOptions } = require('./lib/utils');

const options = getEggOptions();

// throw error when an egg plugin test is using bootstrap
const pkgInfo = require(path.join(options.baseDir || process.cwd(), 'package.json'));
if (pkgInfo.eggPlugin) throw new Error('DO NOT USE bootstrap to test plugin');

let app;
debug('env.ENABLE_MOCHA_PARALLEL: %s, process.env.AUTO_AGENT: %s',
  process.env.ENABLE_MOCHA_PARALLEL, process.env.AUTO_AGENT);
if (process.env.ENABLE_MOCHA_PARALLEL && process.env.AUTO_AGENT) {
  // setup agent first
  app = mockParallelApp({
    ...options,
    beforeInit: async _app => {
      const agent = await setupAgent();
      _app.options.clusterPort = agent.options.clusterPort;
      debug('mockParallelApp beforeInit get clusterPort: %s', _app.options.clusterPort);
    },
  });
  debug('mockParallelApp app: %s', !!app);
} else {
  app = mock.app(options);
  if (typeof beforeAll === 'function') {
    // jest
    beforeAll(() => app.ready());
    afterEach(() => app.backgroundTasksFinished());
    afterEach(mock.restore);
  }
}

module.exports = {
  assert,
  app,
  mock,
  mm: mock,
};
