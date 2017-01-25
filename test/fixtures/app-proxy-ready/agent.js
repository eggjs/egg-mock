'use strict';

const sleep = require('ko-sleep');


module.exports = app => {
  // set timeout let testcase ran before ready
  app.beforeStart(function* () {
    yield sleep(1000);
  });
};
