'use strict';

const sleep = require('mz-modules/sleep');

module.exports = app => {
  app.beforeStart(function* () {
    yield sleep(1000);
    throw new Error('loading error');
  });
};
