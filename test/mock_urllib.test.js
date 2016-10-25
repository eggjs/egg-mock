'use strict';

const pedding = require('pedding');
const path = require('path');
const request = require('supertest');
const assert = require('power-assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_urllib.test.js', function() {

  let app;
  let server;
  let url;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    return app.ready();
  });
  before(() => {
    server = app.listen();
    url = `http://127.0.0.1:${server.address().port}/mock_url`;
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should mock url get and get reponse event on urllib', function(done) {
    done = pedding(2, done);
    app.mockCsrf();
    app.mockUrllib(url, {
      data: new Buffer('mock url get'),
    });

    request(server)
    .get('/urllib')
    .expect({
      get: 'mock url get',
      post: 'url post',
    })
    .expect(200, done);

    app.urllib.once('response', function(result) {
      assert.deepEqual(result.res, {
        status: 200,
        statusCode: 200,
        headers: {},
        size: 12,
        aborted: false,
        rt: 1,
        keepAliveSocket: false,
      });
      done();
    });
  });

  it('should mock url post', function(done) {
    app.mockCsrf();
    app.mockUrllib(url, 'post', {
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

  it('should mock url get and post', function(done) {
    app.mockCsrf();
    app.mockUrllib(url, {
      data: 'mock url get',
    });
    app.mockUrllib(url, 'post', {
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

  it('should support request', function(done) {
    app.mockCsrf();
    app.mockUrllib(url, {
      data: 'mock url get',
    });
    app.mockUrllib(url, 'post', {
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

  it('should support curl', function(done) {
    app.mockCsrf();
    app.mockUrllib(url, {
      data: 'mock url get',
    });
    app.mockUrllib(url, 'post', {
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

  it('should support json', function(done) {
    app.mockCsrf();
    app.mockUrllib(url, {
      data: { method: 'get' },
    });
    app.mockUrllib(url, 'post', {
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

  it('should support text', function(done) {
    app.mockCsrf();
    app.mockUrllib(url, {
      data: 'mock url get',
    });
    app.mockUrllib(url, 'post', {
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

  it('should exits req headers', function(done) {
    app.mockCsrf();
    app.mockUrllib(url, {
      data: 'mock url test',
    });
    request(server)
    .get('/mock_urllib')
    .expect({})
    .expect(200, done);
  });
});
