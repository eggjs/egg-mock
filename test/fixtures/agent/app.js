'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  const done = app.readyCallback('agent:app');
  const p = path.join(__dirname, 'run/test.txt');
  setTimeout(function () {
    fs.readFile(p, 'utf-8', done);
  }, 1000);
};
