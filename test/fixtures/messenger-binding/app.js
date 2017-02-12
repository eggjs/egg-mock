'use strict';

module.exports = app => {
  app.received = [];
  app.messenger.on('action', data => app.received.push(data));

  app.messenger.sendToAgent('action', 'send data when app starting');
  app.ready(() => {
    app.messenger.sendToAgent('action', 'send data when app started');
  });
  app.messenger.on('egg-ready', () => {
    app.eggReady = true;
  });
};
