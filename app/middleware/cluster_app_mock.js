'use strict';

const debug = require('debug')('egg-mock:middleware:cluster_app_mock');

module.exports = () => {
  return function clusterAppMock(ctx, next) {
    if (ctx.path !== '/__egg_mock_call_function') return next();

    debug('%s %s, body: %j', ctx.method, ctx.url, ctx.request.body);
    const { method, property, args, needResult } = ctx.request.body;
    if (!method) {
      ctx.status = 422;
      ctx.body = {
        success: false,
        error: 'Missing method',
      };
      return;
    }
    if (args && !Array.isArray(args)) {
      ctx.status = 422;
      ctx.body = {
        success: false,
        error: 'args should be an Array instance',
      };
      return;
    }
    if (property) {
      if (!ctx.app[property] || typeof ctx.app[property][method] !== 'function') {
        ctx.status = 422;
        ctx.body = {
          success: false,
          error: `method "${method}" not exists on app.${property}`,
        };
        return;
      }
    } else {
      if (typeof ctx.app[method] !== 'function') {
        ctx.status = 422;
        ctx.body = {
          success: false,
          error: `method "${method}" not exists on app`,
        };
        return;
      }
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

    let result;
    if (property) {
      result = ctx.app[property][method](...args);
    } else {
      result = ctx.app[method](...args);
    }
    if (!needResult) {
      result = undefined;
    }
    ctx.body = { success: true, result };
  };
};
