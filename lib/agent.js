let agent;

const Agent = require('./parallel/agent');
const { getEggOptions } = require('./utils');

exports.setupAgent = async () => {
  if (process.env.ENABLE_MOCHA_PARALLEL && process.env.AUTO_AGENT) {
    agent = Agent(getEggOptions());
    await agent.ready();
  }
  return agent;
};

exports.closeAgent = async () => {
  if (agent) {
    await agent.close();
  }
};
