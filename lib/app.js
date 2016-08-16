'use strict';

const path = require('path');
const debug = require('debug')('mm');
const rimraf = require('rimraf');
const formatOptions = require('./format_options');

const apps = new Map();

module.exports = function(options) {
  options = formatOptions(options);
  if (options.cache && apps.has(options.baseDir)) {
    return apps.get(options.baseDir);
  }

  if (options.clean !== false) {
    rimraf.sync(path.join(options.baseDir, 'logs'));
  }

  const agent = getAgent(options);
  const app = getApp(Object.assign({}, options, {agent}));
  merge(app, agent);

  apps.set(options.baseDir, app);
  return app;
};

function getApp(options) {
  debug('getApp from customEgg: %s', options.customEgg);
  const egg = require(options.customEgg);
  const MockApplication = extendsEggApplication(egg, options);
  return new MockApplication(options);
}

function getAgent(options) {
  debug('getAgent from customEgg: %s', options.customEgg);
  const egg = require(options.customEgg);
  const agent = new egg.Agent(options);
  return agent;
}

function extendsEggApplication(egg, options) {
  const symbol = egg.symbol || {};
  // load after agent ready
  class MockApplication extends egg.Application {
    constructor(options) {
      super(options);

      this.on('error', onerror);
      this.ready(() => this.removeListener('error', onerror));
      this.messenger = options.agent.messenger;
      options.agent.ready(this.readyCallback('agent_ready'));
    }

    get [symbol.Loader]() {
      const CustomLoader = super[Symbol.for('egg#loader')] || super[symbol.Loader];
      const self = this;

      class MockLoader extends CustomLoader {
        load() {
          // catch agent's error, send it to app
          const done = self.readyCallback('loader.load');
          options.agent.ready().then(() => {
            super.load();
            done();
          }).catch(done);
        }
      }

      return MockLoader;
    }

    get [Symbol.for('egg#loader')]() {
      return this[symbol.Loader];
    }

    get [Symbol.for('egg#eggPath')]() {
      return path.join(__dirname, '..');
    }

  }

  return MockApplication;
}

function merge(app, agent) {
  app.agent = agent;
  app._close = app.close;
  app.close = function() {
    app._close && app._close();
    agent.close && agent.close();
  };
}

function onerror(err) {
  console.error(err);
  console.error(err.stack);
}
