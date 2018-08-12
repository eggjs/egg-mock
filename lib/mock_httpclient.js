'use strict';
const mm = require('mm');
const extend = require('extend2');

module.exports = function(app) {
  /**
   * mock httpclient
   * @method mockHttpclient
   * @param {String} mockUrl - url
   * @param {String|Array} mockMethod - http method
   * @param {Object} mockResult - you data
   *   - data - buffer / string / json
   *   - status - http status
   *   - headers - response header
   * @return {Context} this
   */
  return function mockHttpclient(mockUrl, mockMethod, mockResult) {
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

    const httpclient = app.httpclient;

    const rawRequest = httpclient.request;

    mm(httpclient, 'requestThunk', _request);
    mm(httpclient, 'request', _request);
    mm(httpclient, 'curl', _request);

    return app;

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
  };
};
