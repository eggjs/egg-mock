'use strict';

const debug = require('debug')('egg-mock:app');

const MOCK_REQUEST_PATH = '/__egg_mock_call_function';

module.exports = app => {
  app.beforeStart(() => {
    // https://eggjs.org/zh-cn/core/security.html#%E5%BF%BD%E7%95%A5-json-%E8%AF%B7%E6%B1%82
    // ignore JSON request
    if (app.config.security && app.config.security.csrf.enable) {
      if (typeof app.config.security.csrf.matching === 'function') {
        const matching = app.config.security.csrf.matching;
        app.config.security.csrf.matching = (...args) => {
          const ctx = args[0];
          if (ctx.path === MOCK_REQUEST_PATH) return false;
          return matching(...args);
        };
      }
    }
    app.post(MOCK_REQUEST_PATH, handleRequest);
  });
};

function* handleRequest() {
  const { method, args } = this.request.body;
  if (!method) {
    this.status = 422;
    this.body = {
      success: false,
      error: 'Missing method',
    };
    return;
  }
  if (args && !Array.isArray(args)) {
    this.status = 422;
    this.body = {
      success: false,
      error: 'args should be an Array instance',
    };
    return;
  }
  if (typeof this.app[method] !== 'function') {
    this.status = 422;
    this.body = {
      success: false,
      error: `method "${method}" not exists on app`,
    };
    return;
  }

  debug('call %s with %j', method, args);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg && typeof arg === 'object') {
      // convert __egg_mock_type back to function
      if (arg.__egg_mock_type === 'function') {
        // eslint-disable-next-line
        args[i] = eval(`(function() { return ${arg.value} })()`);
      } else if (arg.__egg_mock_type === 'error') {
        const err = new Error(arg.message);
        err.name = arg.name;
        err.stack = arg.stack;
        for (const key in arg) {
          if (key !== 'name' && key !== 'message' && key !== 'stack' && key !== '__egg_mock_type') {
            err[key] = arg[key];
          }
        }
        args[i] = err;
      }
    }
  }

  this.app[method](...args);
  this.body = { success: true };
}
