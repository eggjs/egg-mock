'use strict';

const Agent = require('superagent').agent;
const methods = require('methods');
const MockTest = require('./http_test');
const mockHttpServer = require('./mock_http_server');

function TestAgent(app, options) {
  if (!(this instanceof TestAgent)) return new TestAgent(app, options);
  if (options) {
    this._ca = options.ca;
    this._key = options.key;
    this._cert = options.cert;
  }
  Agent.call(this);
  this.app = app;
}

Object.setPrototypeOf(TestAgent.prototype, Agent.prototype);

for (const method of methods) {
  TestAgent.prototype[method] = function request(url, fn) {
    const req = new MockTest(this.app, method.toUpperCase(), url, this._host);
    req.ca(this._ca);
    req.cert(this._cert);
    req.key(this._key);

    req.on('response', this._saveCookies.bind(this));
    req.on('redirect', this._saveCookies.bind(this));
    req.on('redirect', this._attachCookies.bind(this, req));
    this._attachCookies(req);
    this._setDefaults(req);
    if (fn) {
      req.end(fn);
    }
    return req;
  };
}

TestAgent.prototype.del = TestAgent.prototype.delete;

module.exports = (app, option) => {
  const server = mockHttpServer(app);
  return new TestAgent(server, option);
};
