'use strict';

const sleep = require('mz-modules/sleep');

module.exports = app => {
  app.beforeClose(function* () {
    console.log(process.env.CLOSE_THROW);
    if (!process.env.CLOSE_THROW) return;
    yield sleep(1000);
    throw new Error('app close error');
  });
};
