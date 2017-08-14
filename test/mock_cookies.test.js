'use strict';

const request = require('supertest');
const path = require('path');
const assert = require('assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_cookies.test.js', () => {
  let app;
  before(done => {
    app = mm.app({
      baseDir: path.join(fixtures, 'apps/mock_cookies'),
    });
    app.ready(done);
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should not return when don\'t mock cookies', done => {
    const ctx = app.mockContext();
    assert(!ctx.cookies.get('foo'));

    request(app.callback())
      .get('/')
      .expect(function(res) {
        assert.deepEqual(res.body, {});
      })
      .expect(200, done);
  });

  it('should mock cookies', done => {
    app.mockCookies({
      foo: 'bar cookie',
    });
    const ctx = app.mockContext();
    assert(ctx.cookies.get('foo') === 'bar cookie');

    request(app.callback())
      .get('/')
      .expect({
        cookieValue: 'bar cookie',
        cookiesValue: 'bar cookie',
      })
      .expect(200, done);
  });

  it('should pass cookie opt', done => {
    app.mockCookies({});

    request(app.callback())
      .get('/')
      .set('cookie', 'foo=bar cookie')
      .expect({
        cookieValue: 'bar cookie',
        cookiesValue: 'bar cookie',
      })
      .expect(200, done);
  });

});
