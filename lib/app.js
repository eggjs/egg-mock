'use strict';

const co = require('co');
const path = require('path');
const is = require('is-type-of');
const rimraf = require('rimraf');
const sleep = require('ko-sleep');
const ready = require('get-ready');
const detectPort = require('detect-port');
const debug = require('debug')('egg-mock');
const EventEmitter = require('events');
const os = require('os');
const formatOptions = require('./format_options');

const apps = new Map();
const INIT = Symbol('init');
const APP_INIT = Symbol('appInit');
const BIND_EVENT = Symbol('bindEvent');
const INIT_ON_LISTENER = Symbol('initOnListener');
const INIT_ONCE_LISTENER = Symbol('initOnceListener');
const MOCK_APP_METHOD = [
  'ready',
  '_ready',
  '_readyCallbacks',
  'closed',
  'close',
  'agent',
  '_agent',
  '_app',
  'on',
  'once',
];

class MockApplication extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.closed = false;
    this[APP_INIT] = false;
    this[INIT_ON_LISTENER] = new Set();
    this[INIT_ONCE_LISTENER] = new Set();
    ready.mixin(this);

    co(this[INIT].bind(this))
    .then(() => this.ready(true))
    // TODO: implement ready(err)
    // condition for error event
    .catch(err => {
      if (!this[APP_INIT]) {
        this.emit('error', err);
      } else {
        // never run this line
        /* istanbul ignore next */
        console.error(err.stack);
      }
    });
  }

  * [INIT]() {
    this.options.clusterPort = yield detectPort();
    debug('get clusterPort %s', this.options.clusterPort);
    const egg = require(this.options.customEgg);

    const Agent = egg.Agent;
    const agent = this._agent = new Agent(this.options);
    debug('agent instantiate');
    yield agent.ready();
    debug('agent ready');

    const Application = egg.Application;
    const app = this._app = new Application(this.options);
    debug('app instantiate');
    this[APP_INIT] = true;
    debug('this[APP_INIT] = true');
    this[BIND_EVENT]();
    yield app.ready();
    debug('app ready');
  }

  [BIND_EVENT]() {
    for (const args of this[INIT_ON_LISTENER]) {
      debug('on(%s), use cache and pass to app', args);
      this._app.on(...args);
      this.removeListener(...args);
    }
    for (const args of this[INIT_ONCE_LISTENER]) {
      debug('once(%s), use cache and pass to app', args);
      this._app.on(...args);
      this.removeListener(...args);
    }
  }

  on(...args) {
    if (this[APP_INIT]) {
      debug('on(%s), pass to app', args);
      this._app.on(...args);
    } else {
      debug('on(%s), cache it because app has not init', args);
      this[INIT_ON_LISTENER].add(args);
      super.on(...args);
    }
  }

  once(...args) {
    if (this[APP_INIT]) {
      debug('once(%s), pass to app', args);
      this._app.once(...args);
    } else {
      debug('once(%s), cache it because app has not init', args);
      this[INIT_ONCE_LISTENER].add(args);
      super.on(...args);
    }
  }

  close() {
    this.closed = true;
    const arr = [];
    if (this._agent) arr.push(this._agent.close());
    if (this._app) arr.push(this._app.close());
    let p = Promise.all(arr);
    /* istanbul ignore if */
    if (os.platform() === 'win32') {
      p = p.then(() => sleep(1000));
    }
    return p;
  }

  get agent() {
    return this._agent;
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
      if (MOCK_APP_METHOD.includes(prop)) return getProperty(target, prop);
      if (!target[APP_INIT]) throw new Error(`can't get ${prop} before ready`);
      // it's asyncrounus when agent and app are loading,
      // so should get the properties after loader ready
      debug('proxy handler.get %s', prop);
      return target._app[prop];
    },
    set(target, prop, value) {
      if (MOCK_APP_METHOD.includes(prop)) return true;
      if (!target[APP_INIT]) throw new Error(`can't set ${prop} before ready`);
      debug('proxy handler.set %s', prop);
      target._app[prop] = value;
      return true;
    },
    defineProperty(target, prop, descriptor) {
      // can't define properties on MockApplication
      if (MOCK_APP_METHOD.includes(prop)) return true;
      if (!target[APP_INIT]) throw new Error(`can't defineProperty ${prop} before ready`);
      debug('proxy handler.defineProperty %s', prop);
      Object.defineProperty(target._app, prop, descriptor);
      return true;
    },
    deleteProperty(target, prop) {
      // can't delete properties on MockApplication
      if (MOCK_APP_METHOD.includes(prop)) return true;
      if (!target[APP_INIT]) throw new Error(`can't delete ${prop} before ready`);
      debug('proxy handler.deleteProperty %s', prop);
      delete target._app[prop];
      return true;
    },
    getOwnPropertyDescriptor(target, prop) {
      if (MOCK_APP_METHOD.includes(prop)) return Object.getOwnPropertyDescriptor(target, prop);
      if (!target[APP_INIT]) throw new Error(`can't getOwnPropertyDescriptor ${prop} before ready`);
      debug('proxy handler.getOwnPropertyDescriptor %s', prop);
      return Object.getOwnPropertyDescriptor(target._app, prop);
    },
    getPrototypeOf(target) {
      if (!target[APP_INIT]) throw new Error('can\'t getPrototypeOf before ready');
      debug('proxy handler.getPrototypeOf %s');
      return Object.getPrototypeOf(target._app);
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
