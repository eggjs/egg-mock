const mm = require('mm');
const extend = require('extend2');
const is = require('is-type-of');
const mockAgent = require('./mock_agent');

function matchMethod(mockMethods, method) {
  return mockMethods.some(m => m === '*' || m === method);
}
function matchUrl(mockUrl, url) {
  if (url === mockUrl) return true;
  if (mockUrl instanceof RegExp && url.match(mockUrl)) return true;
  return false;
}

function normalizeResult(result) {
  if (is.string(result)) {
    result = { data: result };
  }

  if (!result.status) {
    result.status = 200;
  }

  result.data = result.data || '';
  if (Buffer.isBuffer(result.data)) {
    // do nothing
  } else if (typeof result.data === 'object') {
    // json
    result.data = Buffer.from(JSON.stringify(result.data));
  } else if (typeof result.data === 'string') {
    // string
    result.data = Buffer.from(result.data);
  } else {
    throw new Error('`mockResult.data` must be buffer, string or json');
  }

  if (!result.res) {
    result.res = {
      status: result.status,
    };
  }
  result.responseSize = result.responseSize || 0;
  if (result.data) {
    result.responseSize = result.data.length;
  }
  result.headers = result.headers || {};
  return result;
}

module.exports = app => {
  /**
   * mock httpclient
   * @function mockHttpclient
   * @param {String} mockUrl - url
   * @param {String|Array} mockMethod - http method
   * @param {Object|Function} mockResult - you data
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

    if (app.config.httpclient.useHttpClientNext) {
      // use MockAgent on undici
      let origin = mockUrl;
      let pathname = mockUrl;
      if (typeof mockUrl === 'string') {
        const urlObject = new URL(mockUrl);
        origin = urlObject.origin;
        const orginalPathname = urlObject.pathname;
        pathname = path => {
          if (path === orginalPathname) return true;
          // should match /foo?a=1 including query
          if (path.includes('?')) return path.startsWith(orginalPathname);
          return false;
        };
      } else if (mockUrl instanceof RegExp) {
        let requestOrigin = '';
        origin = value => {
          requestOrigin = value;
          return true;
        };
        pathname = path => {
          return mockUrl.test(`${requestOrigin}${path}`);
        };
      }
      const mockPool = mockAgent.getAgent().get(origin);
      mockMethod.forEach(function(method) {
        if (method === '*') {
          method = () => true;
        }
        mockPool.intercept({
          path: pathname,
          method,
        }).reply(options => {
          // not support mockResult as an async function
          const requestUrl = `${options.origin}${options.path}`;
          const mockRequestResult = is.function(mockResult) ? mockResult(requestUrl, options) : mockResult;
          const result = extend(true, {}, normalizeResult(mockRequestResult));
          return {
            statusCode: result.status,
            data: result.data,
            responseOptions: {
              headers: result.headers,
            },
          };
        }, {
          headers: mockResult.headers || {},
        }).persist();
      });
      return;
    }

    const httpclient = app.httpclient;

    const rawRequest = httpclient.request;

    mm(httpclient, 'requestThunk', _request);
    mm(httpclient, 'request', _request);
    mm(httpclient, 'curl', _request);

    return app;

    // support generator rather than callback and promise
    async function _request(url, opt) {
      opt = opt || {};
      opt.method = (opt.method || 'GET').toUpperCase();
      opt.headers = opt.headers || {};
      if (matchUrl(mockUrl, url) && matchMethod(mockMethod, opt.method)) {
        let mockRequestResult = is.function(mockResult) ? mockResult(url, opt) : mockResult;
        // support mockResult as an async function
        if (is.promise(mockRequestResult)) mockRequestResult = await mockRequestResult;
        const result = extend(true, {}, normalizeResult(mockRequestResult));
        const response = {
          status: result.status,
          statusCode: result.status,
          headers: result.headers,
          size: result.responseSize,
          aborted: false,
          rt: 1,
          keepAliveSocket: result.keepAliveSocket || false,
        };

        httpclient.emit('request', {
          reqId: Date.now(),
          url,
          args: opt,
          ctx: opt.ctx,
        });

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
        return result;
      }
      return rawRequest.call(httpclient, url, opt);
    }
  };
};
