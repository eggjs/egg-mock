const debug = require('util').debuglog('egg-mock:register');
const mock = require('./index').default;
const agentHandler = require('./lib/agent_handler');
const appHandler = require('./lib/app_handler');

exports.mochaGlobalSetup = async () => {
  debug('mochaGlobalSetup, agent.setupAgent() start');
  await agentHandler.setupAgent();
  debug('mochaGlobalSetup, agent.setupAgent() end');
};

exports.mochaGlobalTeardown = async () => {
  debug('mochaGlobalTeardown, agent.closeAgent() start');
  await agentHandler.closeAgent();
  debug('mochaGlobalTeardown, agent.closeAgent() end');
};

exports.mochaHooks = {
  async beforeAll() {
    const app = appHandler.getApp();
    debug('mochaHooks.beforeAll call, _app: %s', app);

    if (app) {
      await app.ready();
    }
  },
  async afterEach() {
    const app = appHandler.getApp();
    debug('mochaHooks.afterEach call, _app: %s', app);
    if (app) {
      await app.backgroundTasksFinished();
    }
    await mock.restore();
  },
};
