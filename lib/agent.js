const debug = require('util').debuglog('egg-mock:bootstrap');
const Agent = require('./parallel/agent');
const { getEggOptions } = require('./utils');

let agent;

exports.setupAgent = async () => {
  debug('setupAgent call, env.ENABLE_MOCHA_PARALLEL: %s, process.env.AUTO_AGENT: %s',
    process.env.ENABLE_MOCHA_PARALLEL, process.env.AUTO_AGENT);
  if (process.env.ENABLE_MOCHA_PARALLEL && process.env.AUTO_AGENT) {
    agent = Agent(getEggOptions());
    await agent.ready();
  }
  return agent;
};

exports.closeAgent = async () => {
  debug('setupAgent call, agent: %s', !!agent);
  if (agent) {
    await agent.close();
  }
};
