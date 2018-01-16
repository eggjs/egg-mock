'use strict';

const assert = require('assert');
const mm = require('..');

describe('test/mock_context.test.js', () => {
  let app;
  before(done => {
    app = mm.app({
      baseDir: 'demo',
    });
    app.ready(done);
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should work on GET with user login', () => {
    const ctx = app.mockContext({
      user: {
        foo: 'bar',
      },
    });

    assert(ctx.user.foo === 'bar');
    return app.httpRequest()
      .get('/user')
      .expect(200)
      .expect({
        foo: 'bar',
      });
  });

  it('should work on POST with user login', () => {
    const ctx = app.mockContext({
      user: {
        foo: 'bar',
      },
    });
    assert(ctx.user.foo === 'bar');

    app.mockCsrf();
    return app.httpRequest()
      .post('/user')
      .send({
        hi: 'body',
        a: 123,
      })
      .expect(200)
      .expect({
        params: {
          hi: 'body',
          a: 123,
        },
        user: {
          foo: 'bar',
        },
      });
  });

  it('should work on POST file with user login', () => {
    const ctx = app.mockContext({
      user: {
        foo: 'bar',
      },
    });
    assert(ctx.user.foo === 'bar');

    app.mockCsrf();
    return app.httpRequest()
      .post('/file')
      .field('title', 'file title')
      .attach('file', __filename)
      .expect(200)
      .expect({
        fields: {
          title: 'file title',
        },
        filename: 'mock_context.test.js',
        user: {
          foo: 'bar',
        },
      });
  });
});
