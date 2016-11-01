'use strict';

const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');

class BarApplication extends egg.Application {
  get [EGG_PATH]() {
    return __dirname;
  }
}

Object.assign(exports, egg);
exports.Application = BarApplication;
