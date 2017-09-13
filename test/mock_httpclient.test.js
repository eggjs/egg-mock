'use strict';

const pedding = require('pedding');
const path = require('path');
const request = require('supertest');
const assert = require('assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_httpclient.test.js', () => {
  let app;
  let server;
  let url;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
    return app.ready();
  });
  before(() => {
    server = app.listen();
    url = `http://127.0.0.1:${server.address().port}/mock_url`;
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should mock url and get reponse event on urllib', done => {
    done = pedding(2, done);
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: new Buffer('mock response'),
    });

    request(server)
      .get('/urllib')
      .expect({
        get: 'mock response',
        post: 'mock response',
      })
      .expect(200, done);

    app.httpclient.once('response', function(result) {
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
    app.httpclient.on('response', function(result) {
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
  });

  it('should mock url support multi method', done => {
    done = pedding(2, done);
    app.mockCsrf();
    app.mockHttpclient(url, [ 'get', 'post' ], {
      data: new Buffer('mock response'),
    });

    request(server)
      .get('/urllib')
      .expect({
        get: 'mock response',
        post: 'mock response',
      })
      .expect(200, done);

    app.httpclient.once('response', function(result) {
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
  });

  it('should mock url method support *', done => {
    done = pedding(2, done);
    app.mockCsrf();
    app.mockHttpclient(url, '*', {
      data: new Buffer('mock response'),
    });

    request(server)
      .get('/urllib')
      .expect({
        get: 'mock response',
        post: 'mock response',
      })
      .expect(200, done);

    app.httpclient.once('response', function(result) {
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
  });

  it('should mock url post', done => {
    app.mockCsrf();
    app.mockHttpclient(url, 'post', {
      data: new Buffer('mock url post'),
    });

    request(server)
      .get('/urllib')
      .expect({
        get: 'url get',
        post: 'mock url post',
      })
      .expect(200, done);
  });

  it('should mock url get and post', done => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url get',
    });
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    request(server)
      .get('/urllib')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200, done);
  });

  it('should support request', done => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url get',
    });
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    request(server)
      .get('/urllib?method=request')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200, done);
  });

  it('should support curl', done => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url get',
    });
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    request(server)
      .get('/urllib?method=curl')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200, done);
  });

  it('should support json', done => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: { method: 'get' },
    });
    app.mockHttpclient(url, 'post', {
      data: { method: 'post' },
    });

    request(server)
      .get('/urllib?dataType=json')
      .expect({
        get: { method: 'get' },
        post: { method: 'post' },
      })
      .expect(200, done);
  });

  it('should support text', done => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url get',
    });
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });

    request(server)
      .get('/urllib?dataType=text')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200, done);
  });

  it('should exits req headers', done => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url test',
    });
    request(server)
      .get('/mock_urllib')
      .expect({})
      .expect(200, done);
  });

  it('should deprecate mockUrllib', done => {
    app.mockCsrf();
    app.mockUrllib(url, {
      data: 'mock url test',
    });
    request(server)
      .get('/mock_urllib')
      .expect({})
      .expect(200, done);
  });

  it('should mock url and get reponse event on urllib', done => {
    app.mockCsrf();
    app.mockHttpclient(/\/mock_url$/, {
      data: new Buffer('mock response'),
    });

    request(server)
      .get('/urllib')
      .expect({
        get: 'mock response',
        post: 'mock response',
      })
      .expect(200, done);
  });

  it('should use copy of mock data', function* () {
    app.mockCsrf();
    app.mockHttpclient(/\/mock_url$/, {
      data: { a: 1 },
    });

    yield request(server)
      .get('/data_type')
      .expect({
        a: 1,
      })
      .expect(200);

    yield request(server)
      .get('/data_type')
      .expect({
        a: 1,
      })
      .expect(200);
  });
});
