const pedding = require('pedding');
const path = require('path');
const fs = require('fs');
const request = require('supertest');
const assert = require('assert');
const { sleep } = require('../lib/utils');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_httpclient_next.test.js', () => {
  let app;
  let server;
  let url;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo_next'),
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
      data: Buffer.from('mock all response'),
    });

    request(server)
      .get('/urllib')
      .expect({
        get: 'mock all response',
        post: 'mock all response',
      })
      .expect(200, done);

    app.httpclient.once('response', result => {
      assert('url' in result.req);
      // assert('size' in result.req);
      assert('options' in result.req);

      assert(result.res.status === 200);
      assert(result.res.statusCode === 200);
      assert.deepEqual(result.res.headers, {});
      assert(result.res.rt);
      done();
    });

    let count = 0;
    app.httpclient.on('response', result => {
      if (count === 0) {
        const options = result.req.options;
        assert(options.method === 'GET');
      } else if (count === 1) {
        const options = result.req.options;
        assert(options.method === 'POST');
        assert(options.headers['x-custom'] === 'custom');
      }
      count++;
    });
  });

  it('should mock url using app.mockAgent().intercept()', async () => {
    app.mockCsrf();
    app.mockAgent()
      .get(new URL(url).origin)
      .intercept({
        path: '/mock_url',
        method: 'GET',
      })
      .reply(200, 'mock GET response');
    app.mockAgent()
      .get(new URL(url).origin)
      .intercept({
        path: '/mock_url',
        method: 'POST',
      })
      .reply(200, 'mock POST response');

    await request(server)
      .get('/urllib')
      .expect({
        get: 'mock GET response',
        post: 'mock POST response',
      })
      .expect(200);
  });

  it('should support on streaming', async () => {
    app.mockHttpclient(url, 'get', {
      data: fs.readFileSync(__filename),
    });

    const res = await request(server)
      .get('/streaming')
      .expect(200);
    assert.match(res.body.toString(), /should support on streaming/);
    assert.equal(res.body.toString(), fs.readFileSync(__filename, 'utf8'));
  });

  it('should mock url support multi method', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, [ 'get', 'post' ], {
      data: Buffer.from('mock response'),
    });

    await request(server)
      .get('/urllib')
      .expect({
        get: 'mock response',
        post: 'mock response',
      })
      .expect(200);
  });

  it('should mock url method support *', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, '*', {
      data: Buffer.from('mock * response'),
    });

    await request(server)
      .get('/urllib')
      .expect({
        get: 'mock * response',
        post: 'mock * response',
      })
      .expect(200);
  });

  it('should mock url post', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'post', {
      data: Buffer.from('mock url post'),
    });

    await request(server)
      .get('/urllib')
      .expect({
        get: 'url get',
        post: 'mock url post',
      })
      .expect(200);
  });

  it('should mock url get and post', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });
    app.mockHttpclient(url, {
      data: 'mock url get',
    });

    await request(server)
      .get('/urllib')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200);
  });

  it('should support request', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });
    app.mockHttpclient(url, {
      data: 'mock url get',
    });

    await request(server)
      .get('/urllib?method=request')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200);
  });

  it('should support persist = false', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url',
      persist: false,
    });

    await request(server)
      .get('/urllib?method=request')
      .expect({
        get: 'mock url',
        post: 'url post',
      })
      .expect(200);
  });

  it('should support persist = true and ignore repeats = 1', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url',
      persist: true,
      repeats: 1,
    });

    await request(server)
      .get('/urllib?method=request')
      .expect({
        get: 'mock url',
        post: 'mock url',
      })
      .expect(200);
  });

  it('should support persist = false and repeats = 2', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url',
      delay: 100,
      persist: false,
      repeats: 2,
    });

    await request(server)
      .get('/urllib?method=request')
      .expect({
        get: 'mock url',
        post: 'mock url',
      })
      .expect(200);

    await request(server)
      .get('/urllib?method=request')
      .expect({
        get: 'url get',
        post: 'url post',
      })
      .expect(200);
  });

  it('should support curl', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });
    app.mockHttpclient(url, {
      data: 'mock url get',
    });

    await request(server)
      .get('/urllib?method=curl')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200);
  });

  it('should support json', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'get', {
      data: { method: 'get' },
    });
    app.mockHttpclient(url, 'post', {
      data: { method: 'post' },
    });

    await request(server)
      .get('/urllib?dataType=json')
      .expect({
        get: { method: 'get' },
        post: { method: 'post' },
      })
      .expect(200);
  });

  it('should support text', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'post', {
      data: 'mock url post',
    });
    app.mockHttpclient(url, {
      data: 'mock url get',
    });

    await request(server)
      .get('/urllib?dataType=text')
      .expect({
        get: 'mock url get',
        post: 'mock url post',
      })
      .expect(200);
  });

  it('should exits req headers', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, {
      data: 'mock url test',
    });
    await request(server)
      .get('/mock_urllib')
      .expect({})
      .expect(200);
  });

  it('should mock url support RegExp', async () => {
    app.mockCsrf();
    app.mockHttpclient(/\/mock_url$/, {
      data: Buffer.from('mock response'),
    });

    await request(server)
      .get('/urllib')
      .expect({
        get: 'mock response',
        post: 'mock response',
      })
      .expect(200);
  });

  it('should use copy of mock data', async () => {
    app.mockCsrf();
    app.mockHttpclient(/\/mock_url$/, {
      data: { a: 1 },
    });

    await request(server)
      .get('/data_type')
      .expect({
        a: 1,
      })
      .expect(200);

    await request(server)
      .get('/data_type')
      .expect({
        a: 1,
      })
      .expect(200);
  });

  it('should support fn', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'get', (url, opt) => {
      return `mock ${url} with ${opt.path}`;
    });
    app.mockHttpclient(url, 'post', 'mock url post');

    await request(server)
      .get('/urllib')
      .query({ data: JSON.stringify({ a: 'b' }) })
      .expect({
        get: `mock ${url}?a=b with /mock_url?a=b`,
        post: 'mock url post',
      })
      .expect(200);
  });

  // not support in urllib3
  it.skip('should support async function', async () => {
    app.mockCsrf();
    app.mockHttpclient(url, 'get', async (url, opt) => {
      await sleep(100);
      return `mock ${url} with ${opt.data.a}`;
    });
    app.mockHttpclient(url, 'post', 'mock url post');

    await request(server)
      .get('/urllib')
      .query({ data: JSON.stringify({ a: 'b' }) })
      .expect({
        get: `mock ${url} with b`,
        post: 'mock url post',
      })
      .expect(200);
  });

  it('should mock fn with multi-request without error', async () => {
    app.mockCsrf();
    let i = 0;
    app.mockHttpclient(url, 'post', () => {
      i++;
      return {};
    });

    await request(server).get('/urllib').expect(200);
    await request(server).get('/urllib').expect(200);
    await request(server).get('/urllib').expect(200);
    assert(i === 3);
  });
});
