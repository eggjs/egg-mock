'use strict';

const { sleep } = require('../../../lib/utils');

module.exports = app => {
  app.ready(() => {
    // after ready
    app.emit('appReady');
  });

  process.nextTick(() => {
    // before ready, after app instantiate
    app.emit('appInstantiated');
  });

  app.beforeStart(function* () {
    yield sleep(1000);
  });
};
