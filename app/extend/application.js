'use strict';

const mm = require('mm');
const http = require('http');
const merge = require('merge-descriptors');
const is = require('is-type-of');
const assert = require('assert');
const extend = require('extend2');
const supertestRequest = require('../../lib/supertest');

const ORIGIN_TYPES = Symbol('egg-mock:originTypes');

module.exports = {
  /**
   * mock Context
   * @method App#mockContext
   * @param {Object} data - ctx data
   * @return {Context} ctx
   * @example
   * ```js
   * const ctx = app.mockContext({
   *   user: {
   *     name: 'Jason'
   *   }
   * });
   * console.log(ctx.user.name); // Jason
   *
   * // controller
   * module.exports = function*() {
   *   this.body = this.user.name;
   * };
   * ```
   */
  mockContext(data) {
    data = data || {};

    if (this._customMockContext) {
      this._customMockContext(data);
    }

    // 使用者自定义mock，可以覆盖上面的 mock
    for (const key in data) {
      mm(this.context, key, data[key]);
    }

    const req = this.mockRequest(data);
    const res = new http.ServerResponse(req);

    return this.createContext(req, res);
  },

  /**
   * mock cookie session
   * @method App#mockSession
   * @param {Object} data - session object
   * @return {App} this
   */
  mockSession(data) {
    if (!data) {
      return this;
    }

    if (is.object(data) && !data.save) {
      Object.defineProperty(data, 'save', {
        value: () => {},
        enumerable: false,
      });
    }
    mm(this.context, 'session', data);
    return this;
  },

  /**
   * Mock service
   * @method App#mockService
   * @param {String} service - name
   * @param {String} methodName - method
   * @param {Object/Function/Error} fn - mock you data
   * @return {App} this
   */
  mockService(service, methodName, fn) {
    if (typeof service === 'string') {
      const arr = service.split('.');
      service = this.serviceClasses;
      for (const key of arr) {
        service = service[key];
      }
      service = service.prototype || service;
    }
    this._mockFn(service, methodName, fn);
    return this;
  },

  /**
   * mock service that return error
   * @method App#mockServiceError
   * @param {String} service - name
   * @param {String} methodName - method
   * @param {Error} [err] - error infomation
   * @return {App} this
   */
  mockServiceError(service, methodName, err) {
    if (typeof err === 'string') {
      err = new Error(err);
    } else if (!err) {
      // mockServiceError(service, methodName)
      err = new Error('mock ' + methodName + ' error');
    }
    this.mockService(service, methodName, err);
    return this;
  },

  _mockFn(obj, name, data) {
    const origin = obj[name];
    assert(is.function(origin), `property ${name} in original object must be function`);

    // keep origin properties' type to support mock multitimes
    if (!obj[ORIGIN_TYPES]) obj[ORIGIN_TYPES] = {};
    let type = obj[ORIGIN_TYPES][name];
    if (!type) {
      type = obj[ORIGIN_TYPES][name] = is.generatorFunction(origin) || is.asyncFunction(origin) ? 'async' : 'sync';
    }

    if (is.function(data)) {
      const fn = data;
      // if original is generator function or async function
      // but the mock function is normal function, need to change it return a promise
      if (type === 'async' &&
      (!is.generatorFunction(fn) && !is.asyncFunction(fn))) {
        mm(obj, name, function(...args) {
          return new Promise(resolve => {
            resolve(fn.apply(this, args));
          });
        });
        return;
      }

      mm(obj, name, fn);
      return;
    }

    if (type === 'async') {
      mm(obj, name, () => {
        return new Promise((resolve, reject) => {
          if (data instanceof Error) return reject(data);
          resolve(data);
        });
      });
      return;
    }

    mm(obj, name, () => {
      if (data instanceof Error) {
        throw data;
      }
      return data;
    });
  },

  /**
   * mock request
   * @method App#mockRequest
   * @param {Request} req - mock request
   * @return {Request} req
   */
  mockRequest(req) {
    req = Object.assign({}, req);
    const headers = req.headers || {};
    for (const key in req.headers) {
      headers[key.toLowerCase()] = req.headers[key];
    }
    if (!headers['x-forwarded-for']) {
      headers['x-forwarded-for'] = '127.0.0.1';
    }
    req.headers = headers;
    merge(req, {
      query: {},
      querystring: '',
      host: '127.0.0.1',
      hostname: '127.0.0.1',
      protocol: 'http',
      secure: 'false',
      method: 'GET',
      url: '/',
      path: '/',
      socket: {
        remoteAddress: '127.0.0.1',
        remotePort: 7001,
      },
    });
    return req;
  },

  /**
   * mock cookies
   * @method App#mockCookies
   * @param {Object} cookies - cookie
   * @return {Context} this
   */
  mockCookies(cookies) {
    if (!cookies) {
      return this;
    }
    const createContext = this.createContext;
    mm(this, 'createContext', function(req, res) {
      const ctx = createContext.call(this, req, res);
      const getCookie = ctx.cookies.get;
      mm(ctx.cookies, 'get', function(key, opts) {
        if (cookies[key]) {
          return cookies[key];
        }
        return getCookie.call(this, key, opts);
      });
      return ctx;
    });
    return this;
  },

  /**
   * mock header
   * @method App#mockHeaders
   * @param {Object} headers - header 对象
   * @return {Context} this
   */
  mockHeaders(headers) {
    if (!headers) {
      return this;
    }
    const getHeader = this.request.get;
    mm(this.request, 'get', function(field) {
      const header = findHeaders(headers, field);
      if (header) return header;
      return getHeader.call(this, field);
    });
    return this;
  },

  /**
   * mock csrf
   * @method App#mockCsrf
   * @return {App} this
   * @sice 1.11
   */
  mockCsrf() {
    mm(this.context, 'assertCSRF', () => {});
    mm(this.context, 'assertCsrf', () => {});
    return this;
  },

  /**
   * mock httpclient
   * @method App#mockHttpclient
   * @param {String} mockUrl - url
   * @param {String|Array} mockMethod - http method
   * @param {Object} mockResult - you data
   *   - data - buffer / string / json
   *   - status - http status
   *   - headers - response header
   * @return {Context} this
   */
  mockHttpclient(mockUrl, mockMethod, mockResult) {
    if (!mockResult) {
      // app.mockHttpclient(mockUrl, mockResult)
      mockResult = mockMethod;
      mockMethod = '*';
    }
    if (!Array.isArray(mockMethod)) mockMethod = [ mockMethod ];
    mockMethod = mockMethod.map(method => (method || 'GET').toUpperCase());

    if (!mockResult.status) {
      mockResult.status = 200;
    }

    mockResult.data = mockResult.data || '';
    if (Buffer.isBuffer(mockResult.data)) {
      // do nothing
    } else if (typeof mockResult.data === 'object') {
      // json
      mockResult.data = new Buffer(JSON.stringify(mockResult.data));
    } else if (typeof mockResult.data === 'string') {
      // string
      mockResult.data = new Buffer(mockResult.data);
    } else {
      throw new Error('`mockResult.data` must be buffer, string or json');
    }

    if (!mockResult.res) {
      mockResult.res = {
        status: mockResult.status,
      };
    }
    mockResult.responseSize = mockResult.responseSize || 0;
    if (mockResult.data) {
      mockResult.responseSize = mockResult.data.length;
    }
    mockResult.headers = mockResult.headers || {};

    const httpclient = this.httpclient;
    const rawRequest = httpclient.request;

    mm(httpclient, 'requestThunk', _request);
    mm(httpclient, 'request', _request);
    mm(httpclient, 'curl', _request);

    return this;

    function matchMethod(method) {
      return mockMethod.some(m => m === '*' || m === method);
    }
    function matchUrl(url) {
      if (url === mockUrl) return true;
      if (mockUrl instanceof RegExp && url.match(mockUrl)) return true;
      return false;
    }

    // support generator rather than callback and promise
    function _request(url, opt) {
      opt = opt || {};
      opt.method = (opt.method || 'GET').toUpperCase();
      opt.headers = opt.headers || {};
      if (matchUrl(url) && matchMethod(opt.method)) {
        const result = extend(true, {}, mockResult);
        const response = {
          status: result.status,
          statusCode: result.status,
          headers: result.headers,
          size: result.responseSize,
          aborted: false,
          rt: 1,
          keepAliveSocket: result.keepAliveSocket || false,
        };

        httpclient.emit('response', {
          error: null,
          ctx: opt.ctx,
          req: {
            url,
            options: opt,
            size: result.requestSize,
          },
          res: response,
        });
        if (opt.dataType === 'json') {
          try {
            result.data = JSON.parse(result.data);
          } catch (err) {
            err.name = 'JSONResponseFormatError';
            throw err;
          }
        } else if (opt.dataType === 'text') {
          result.data = result.data.toString();
        }
        return Promise.resolve(result);
      }
      return rawRequest.call(httpclient, url, opt);
    }
  },

  mockUrllib(...args) {
    this.deprecate('[egg-mock] Please use app.mockHttpclient instead of app.mockUrllib');
    return this.mockHttpclient(...args);
  },

  /**
   * @see mm#restore
   * @method App#mockRestore
   */
  mockRestore: mm.restore,

  /**
   * @see mm
   * @method App#mm
   */
  mm,

  /**
   * override loadAgent
   * @method App#loadAgent
   */
  loadAgent() {},

  /**
   * mock serverEnv
   * @method App#mockEnv
   * @param  {String} env - serverEnv
   * @return {App} this
   */
  mockEnv(env) {
    mm(this.config, 'env', env);
    mm(this.config, 'serverEnv', env);
    return this;
  },

  /**
   * http request helper
   * @method App#httpRequest
   * @return {SupertestRequest} req - supertest request
   * @see https://github.com/visionmedia/supertest
   */
  httpRequest() {
    return supertestRequest(this);
  },
};

function findHeaders(headers, key) {
  if (!headers || !key) {
    return null;
  }
  key = key.toLowerCase();
  for (const headerKey in headers) {
    if (key === headerKey.toLowerCase()) {
      return headers[headerKey];
    }
  }
  return null;
}
