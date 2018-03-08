'use strict';

const methods = require('methods');
const EggTest = require('./http_test');
const http = require('http');
const _server = Symbol('_server');

// patch from https://github.com/visionmedia/supertest/blob/199506d8dbfe0bb1434fc07c38cdcd1ab4c7c926/index.js#L19

/**
 * Test against the given `app`,
 * returning a new `Test`.
 *
 * @param {Application} app
 * @return {Test}
 * @api public
 */

module.exports = app => {
  let server = app[_server] || app.callback();
  if (typeof server === 'function') {
    server = http.createServer(server);
    // cache server, avoid create many times
    app[_server] = server;
    // emit server event just like egg-cluster does
    // https://github.com/eggjs/egg-cluster/blob/master/lib/app_worker.js#L52
    app.emit('server', server);
  }
  const obj = {};
  for (const method of methods) {
    obj[method] = url => {
      // support pathFor(url)
      if (url[0] !== '/') {
        const realUrl = app.router.pathFor(url);
        if (!realUrl) throw new Error(`Can\'t find router:${url}, please check your \'app/router.js\'`);
        url = realUrl;
      }

      return new EggTest(server, method, url);
    };
  }
  obj.del = obj.delete;
  return obj;
};
