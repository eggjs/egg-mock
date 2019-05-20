'use strict';

const pedding = require('pedding');
const path = require('path');
const assert = require('assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

const url = 'http://127.0.0.1:9989/mock_url';

describe('test/mock_agent_httpclient.test.js', () => {
  let app;
  let agent;
  let httpclient;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
    return app.ready();
  });
  before(() => {
    agent = app.agent;
    httpclient = crtHttpclient(agent);
  });
  after(() => app.agent.close());
  afterEach(mm.restore);

  it('should mock url and get reponse event on urllib', done => {
    done = pedding(3, done);
    agent.mockHttpclient(url, {
      data: Buffer.from('mock response'),
    });

    agent.httpclient.once('request', function(meta) {
      assert('url' in meta);
      assert('args' in meta);
      done();
    });

    agent.httpclient.once('response', function(result) {
      assert('url' in result.req);
      assert('size' in result.req);
      assert('options' in result.req);

      assert.deepEqual(result.res, {
        status: 200,
        statusCode: 200,
        headers: {},
        size: 13,
        aborted: false,
        rt: 1,
        keepAliveSocket: false,
      });
      done();
    });

    let count = 0;
    agent.httpclient.on('response', function(result) {
      if (count === 0) {
        assert.deepEqual(result.req.options, {
          dataType: undefined,
          method: 'GET',
          headers: {},
        });
      } else if (count === 1) {
        assert.deepEqual(result.req.options, {
          dataType: undefined,
          method: 'POST',
          headers: {
            'x-custom': 'custom',
          },
        });
      }
      count++;
    });

    httpclient()
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock response',
          post: 'mock response',
        });
        done();
      });
  });

  it('should mock url support multi method', done => {
    done = pedding(2, done);
    agent.mockHttpclient(url, [ 'get', 'post' ], {
      data: Buffer.from('mock response'),
    });

    agent.httpclient.once('response', function(result) {
      assert.deepEqual(result.res, {
        status: 200,
        statusCode: 200,
        headers: {},
        size: 13,
        aborted: false,
        rt: 1,
        keepAliveSocket: false,
      });
      done();
    });

    httpclient()
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock response',
          post: 'mock response',
        });
        done();
      });
  });

  it('should mock url method support *', done => {
    done = pedding(2, done);
    agent.mockHttpclient(url, '*', {
      data: Buffer.from('mock response'),
    });

    agent.httpclient.once('response', function(result) {
      assert.deepEqual(result.res, {
        status: 200,
        statusCode: 200,
        headers: {},
        size: 13,
        aborted: false,
        rt: 1,
        keepAliveSocket: false,
      });
      done();
    });

    httpclient()
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock response',
          post: 'mock response',
        });
        done();
      });
  });

  it('should mock url get and post', done => {
    agent.mockHttpclient(url, {
      data: 'mock url get',
    });
    agent.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    httpclient()
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock url get',
          post: 'mock url post',
        });
        done();
      });
  });

  it('should support request', done => {
    agent.mockHttpclient(url, {
      data: 'mock url get',
    });
    agent.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    httpclient('request')
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock url get',
          post: 'mock url post',
        });
        done();
      });
  });

  it('should support curl', done => {
    agent.mockHttpclient(url, {
      data: 'mock url get',
    });
    agent.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    httpclient('curl')
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock url get',
          post: 'mock url post',
        });
        done();
      });
  });

  it('should support json', done => {
    agent.mockHttpclient(url, {
      data: { method: 'get' },
    });
    agent.mockHttpclient(url, 'post', {
      data: { method: 'post' },
    });

    httpclient('request', 'json')
      .then(data => {
        assert.deepEqual(data, {
          get: { method: 'get' },
          post: { method: 'post' },
        });
        done();
      });
  });

  it('should support text', done => {
    agent.mockHttpclient(url, {
      data: 'mock url get',
    });
    agent.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    httpclient('request', 'text')
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock url get',
          post: 'mock url post',
        });
        done();
      });
  });

  it('should mock url and get reponse event on urllib', done => {
    agent.mockHttpclient(url, {
      data: Buffer.from('mock response'),
    });

    httpclient()
      .then(data => {
        assert.deepEqual(data, {
          get: 'mock response',
          post: 'mock response',
        });
        done();
      });
  });

});

function crtHttpclient(app) {
  return (method = 'request', dataType) => {
    const r1 = app.httpclient[method](url, {
      dataType,
    });

    const r2 = app.httpclient[method](url, {
      method: 'POST',
      dataType,
      headers: {
        'x-custom': 'custom',
      },
    });
    return Promise.all([ r1, r2 ]).then(([ r1, r2 ]) => {
      return {
        get: Buffer.isBuffer(r1.data) ? r1.data.toString() : r1.data,
        post: Buffer.isBuffer(r2.data) ? r2.data.toString() : r2.data,
      };
    });
  };
}

