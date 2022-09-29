'use strict';

const { sleep } = require('../../../lib/utils');

module.exports = app => {
  // set timeout let testcase ran before ready
  app.beforeStart(function* () {
    yield sleep(1000);
  });
};
