'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Client = require('./client');

module.exports = function(agent) {
  const done = agent.readyCallback('agent:agent');
  const p = path.join(__dirname, 'run/test.txt');
  mkdirp.sync(path.join(__dirname, 'run'));
  fs.writeFile(p, '123', done);

  agent.client = agent.cluster(Client).create();
};
