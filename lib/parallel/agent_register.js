const Agent = require('./agent');
const { getEggOptions } = require('../utils');
const mock = require('../../index').default;

let agent;
exports.mochaGlobalSetup = async () => {
  agent = Agent(getEggOptions());
  await agent.ready();
};

exports.mochaGlobalTeardown = async () => {
  if (agent) {
    await agent.close();
  }
};

exports.mochaHooks = {
  async beforeAll() {
    const { app } = require('../../bootstrap');
    if (app) {
      await app.ready();
    }
  },
  async afterEach() {
    const { app } = require('../../bootstrap');
    if (app) {
      await app.backgroundTasksFinished();
    }
    await mock.restore();
  },
};
