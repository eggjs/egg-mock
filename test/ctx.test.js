'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/ctx.test.js', () => {

  afterEach(mm.restore);

  let app;
  before(done => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
    app.ready(done);
  });
  after(() => app.close());

  it('should has logger, app, request', () => {
    const ctx = app.mockContext();
    assert(ctx.app instanceof Object);
    assert(ctx.logger instanceof Object);
    assert(ctx.coreLogger instanceof Object);
    assert(ctx.request.url === '/');
    assert(ctx.request.ip === '127.0.0.1');
  });

  it('should ctx.ip work', () => {
    const ctx = app.mockContext();
    ctx.request.headers['x-forwarded-for'] = '';
    assert(ctx.request.ip === '127.0.0.1');
  });

  it('should has services', function* () {
    const ctx = app.mockContext();
    const data = yield ctx.service.foo.get('foo');
    assert(data === 'bar');
  });

  it('should not override mockData', function* () {
    const mockData = { user: 'popomore' };
    app.mockContext(mockData);
    app.mockContext(mockData);
    assert(!mockData.headers);
    assert(!mockData.method);
  });

  describe('mockContextScope', () => {
    it('should not conflict with nest call', async () => {
      await app.mockContextScope(async ctx => {
        const currentStore = app.ctxStorage.getStore();
        assert(ctx === currentStore);

        await app.mockContextScope(async nestCtx => {
          const currentStore = app.ctxStorage.getStore();
          assert(nestCtx === currentStore);
        });
      });
    });

    it('should not conflict with concurrent call', async () => {
      await Promise.all([
        await app.mockContextScope(async ctx => {
          const currentStore = app.ctxStorage.getStore();
          assert(ctx === currentStore);
        }),
        await app.mockContextScope(async ctx => {
          const currentStore = app.ctxStorage.getStore();
          assert(ctx === currentStore);
        }),
      ]);

    });
  });


});
