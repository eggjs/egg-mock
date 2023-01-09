const mock = require('./index').default;
const agent = require('./lib/agent');

exports.mochaGlobalSetup = async () => {
  await agent.setupAgent();
};

exports.mochaGlobalTeardown = async () => {
  await agent.closeAgent();
};

exports.mochaHooks = {
  async beforeAll() {
    const { app } = require('./bootstrap');
    if (app) {
      await app.ready();
    }
  },
  async afterEach() {
    const { app } = require('./bootstrap');
    if (app) {
      await app.backgroundTasksFinished();
    }
    await mock.restore();
  },
};
