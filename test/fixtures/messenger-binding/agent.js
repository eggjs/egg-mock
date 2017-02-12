'use strict';

module.exports = agent => {
  agent.received = [];
  agent.messenger.on('action', data => agent.received.push(data));

  agent.messenger.sendToApp('action', 'send data when agent starting');
  agent.ready(() => {
    agent.messenger.sendToApp('action', 'send data when agent started');
  });
  agent.messenger.on('egg-ready', () => {
    agent.messenger.sendToApp('action', 'send data when server started');
  });
  agent.messenger.on('egg-ready', () => {
    agent.eggReady = true;
  });
};
