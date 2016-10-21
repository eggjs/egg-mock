'use strict';

const egg = require('egg');

function startCluster(options) {
  // 只为了测试 eggPath 是否存在
  console.log(options.eggPath);
  delete options.eggPath;
  egg.startCluster(options);
}

Object.assign(exports, egg, { startCluster });
