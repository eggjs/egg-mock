const mock = require('./index').default;
const agent = require('./lib/agent');

exports.mochaGlobalSetup = async () => {
  await agent.setupAgent();
};

exports.mochaGlobalTeardown = async () => {
  await agent.closeAgent();
};

let _inited = false;
let _app;
exports.mochaHooks = {
  async beforeAll() {
    if (!_inited) {
      _inited = true;
      try {
        const { app } = require('./bootstrap');
        _app = app;
      } catch {
        // ignore require error
        // it will throw error on non egg project, e.g.: Error: egg is not found in /foo/bar
        return;
      }
      if (_app) {
        await _app.ready();
      }
    }
  },
  async afterEach() {
    if (_app) {
      await _app.backgroundTasksFinished();
    }
    await mock.restore();
  },
};
