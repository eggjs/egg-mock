'use strict';

const egg = require('egg');

function startCluster(options) {
  // print for the testcase that will assert stdout
  console.log(options.eggPath);
  delete options.eggPath;
  egg.startCluster(options);
}

Object.assign(exports, egg, { startCluster });
