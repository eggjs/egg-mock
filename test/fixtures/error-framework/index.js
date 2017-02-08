'use strict';

const egg = require('egg');

class Application extends egg.Application {
  constructor() {
    throw new Error('start error');
  }
}

Object.assign(exports, egg, { Application });
