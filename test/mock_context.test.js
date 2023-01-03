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
      tracer: {
        traceId: 'foo-traceId',
      },
    });

    assert(ctx.user.foo === 'bar');
    return app.httpRequest()
      .get('/user')
      .expect(200)
      .expect({
        foo: 'bar',
      })
      .expect('x-request-url', '/user');
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

  it('should work on POST file with user login', async () => {
    const ctx = app.mockContext({
      user: {
        foo: 'bar',
      },
      traceId: `trace-${Date.now}`,
    });
    assert(ctx.user.foo === 'bar');
    const ctxFromStorage = app.ctxStorage.getStore();
    assert(ctxFromStorage === ctx);
    assert(app.currentContext === ctx);

    app.mockCsrf();
    await app.httpRequest()
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
        traceId: ctx.traceId,
        ctxFromStorageUser: ctxFromStorage.user,
        ctxFromStorageTraceId: ctxFromStorage.traceId,
      });
    const ctxFromStorage2 = app.ctxStorage.getStore();
    assert(ctxFromStorage2 === ctx);
    mm.restore();
    const ctxFromStorage3 = app.ctxStorage.getStore();
    assert(!ctxFromStorage3);
    assert(!app.currentContext);
  });
});
