'use strict';

module.exports = app => {
  app.received = [];
  app.messenger.on('action', data => app.received.push(data));

  app.messenger.on('app-action', () => {
    app.recievedAppAction = true;
  });

  app.messenger.on('broadcast-action', () => {
    app.recievedBroadcastAction = true;
  });

  app.messenger.on('agent-recieved-broadcast-action', () => {
    app.recievedAgentRecievedAction = true;
  });

  app.messenger.sendToAgent('action', 'send data when app starting');

  app.ready(() => {
    app.messenger.sendToAgent('action', 'send data when app started');
    app.messenger.broadcast('broadcast-action', 'broadcast action');
    app.messenger.sendToApp('app-action', 'send action to app');
  });
  app.messenger.on('egg-ready', data => {
    app.eggReady = true;
    app.eggReadyData = data;
  });
};
