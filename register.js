const debug = require('util').debuglog('egg-mock:register');
const mock = require('./index').default;
const agent = require('./lib/agent');

exports.mochaGlobalSetup = async () => {
  debug('mochaGlobalSetup, agent.setupAgent() start');
  await agent.setupAgent();
  debug('mochaGlobalSetup, agent.setupAgent() end');
};

exports.mochaGlobalTeardown = async () => {
  debug('mochaGlobalTeardown, agent.closeAgent() start');
  await agent.closeAgent();
  debug('mochaGlobalTeardown, agent.closeAgent() end');
};

let _inited = false;
let _app;
exports.mochaHooks = {
  async beforeAll() {
    debug('mochaHooks.beforeAll call, _inited: %s, _app: %s', _inited, !!_app);
    if (!_inited) {
      _inited = true;
      try {
        const { app } = require('./bootstrap');
        _app = app;
      } catch (err) {
        // ignore require error
        // it will throw error on non egg project, e.g.: Error: egg is not found in /foo/bar
        debug('require bootstrap app error: %s', err);
        return;
      }
      if (_app) {
        await _app.ready();
      }
    }
  },
  async afterEach() {
    debug('mochaHooks.afterEach call, _inited: %s, _app: %s', _inited, !!_app);
    if (_app) {
      await _app.backgroundTasksFinished();
    }
    await mock.restore();
  },
};
