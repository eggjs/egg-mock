'use strict';

module.exports = agent => {
  agent.received = [];
  agent.messenger.on('action', data => agent.received.push(data));

  agent.messenger.on('broadcast-action', () => {
    agent.recievedBroadcastAction = true;
    agent.messenger.sendToApp('agent-recieved-broadcast-action');
  });

  agent.messenger.sendToApp('action', 'send data when agent starting');
  agent.ready(() => {
    agent.messenger.sendToApp('action', 'send data when agent started');
  });
  agent.messenger.on('egg-ready', () => {
    agent.messenger.sendToApp('action', 'send data when server started');
    process.nextTick(() => agent.messenger.sendRandom('action', 'send data to a random app'));
  });
  agent.messenger.on('egg-ready', data => {
    agent.eggReady = true;
    agent.eggReadyData = data;
  });
};
