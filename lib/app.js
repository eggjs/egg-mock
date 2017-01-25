'use strict';

const co = require('co');
const path = require('path');
const is = require('is-type-of');
const rimraf = require('rimraf');
const sleep = require('ko-sleep');
const ready = require('get-ready');
const EventEmitter = require('events');
const detectPort = require('detect-port');
const formatOptions = require('./format_options');

const apps = new Map();
const INIT = Symbol('init');
const MOCK_APP_METHOD = [
  'ready',
  '_ready',
  '_readyCallbacks',
  'closed',
  'close',
  'agent',
  'on',
  'once',
];

class MockApplication extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.isReady = false;
    this.closed = false;
    ready.mixin(this);

    co(this[INIT].bind(this))
    .then(() => {
      this.isReady = true;
      this.ready(true);
    })
    .catch(err => this.emit('error', err));
  }

  * [INIT]() {
    this.options.clusterPort = yield detectPort();
    const egg = require(this.options.customEgg);

    const Agent = egg.Agent;
    const agent = this.agent = new Agent(this.options);
    yield agent.ready();

    const Application = egg.Application;
    const app = this.app = new Application(this.options);
    yield app.ready();
  }

  close() {
    this.closed = true;
    return Promise.all([
      this.agent.close(),
      this.app.close(),
    ]).then(() => sleep(1000));
  }
}

module.exports = function(options) {
  options = formatOptions(options);
  if (options.cache && apps.has(options.baseDir)) {
    const app = apps.get(options.baseDir);
    // return cache when it hasn't been killed
    if (!app.closed) {
      return app;
    }
    // delete the cache when it's closed
    apps.delete(options.baseDir);
  }

  if (options.clean !== false) {
    rimraf.sync(path.join(options.baseDir, 'logs'));
  }

  let app = new MockApplication(options);
  app = new Proxy(app, {
    get(target, prop) {
      // don't delegate properties on MockApplication
      if (MOCK_APP_METHOD.includes(prop)) {
        return getProperty(target, prop);
      }
      // it's asyncrounus when agent and app are loading,
      // so should get the properties after loader ready
      if (target.isReady) {
        return getProperty(target.app, prop);
      }
      throw new Error(`can't get ${prop} before ready`);
    },
    set(target, prop, value) {
      if (MOCK_APP_METHOD.includes(prop)) return true;
      if (target.isReady) {
        target.app[prop] = value;
        return true;
      }
      throw new Error(`can't set ${prop} before ready`);
    },
  });

  apps.set(options.baseDir, app);
  return app;
};

function getProperty(target, prop) {
  const member = target[prop];
  if (is.function(member)) {
    return member.bind(target);
  }
  return member;
}
