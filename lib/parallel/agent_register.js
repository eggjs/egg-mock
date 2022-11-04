const Agent = require('./agent');
const { getEggOptions } = require('../utils');

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
