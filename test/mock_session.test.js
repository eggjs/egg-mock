'use strict';

const mm = require('..');
const assert = require('assert');

describe('test/mock_session.test.js', () => {
  afterEach(mm.restore);

  describe('single process mode', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'demo',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should mock session', () => {
      const obj = {
        user: {
          foo: 'bar',
        },
        hello: 'egg mock session data',
      };

      // const ctx = app.mockContext();
      app.mockSession(obj);
      // assert.deepEqual(ctx.session, obj);

      return app.httpRequest()
        .get('/session')
        .expect({
          user: {
            foo: 'bar',
          },
          hello: 'egg mock session data',
        });
    });

    it.skip('should support mock session with plain type', () => {
      const ctx = app.mockContext();
      app.mockSession();
      app.mockSession('123');
      assert(ctx.session === '123');
      assert(!ctx.session.save);
    });

    it('should mock restore', () => {
      return app.httpRequest()
        .get('/session')
        .expect({});
    });
  });

  describe('cluster process mode', () => {
    let app;
    before(() => {
      app = mm.cluster({
        baseDir: 'demo',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should mock session', () => {
      app.mockSession({
        user: {
          foo: 'bar',
        },
        hello: 'egg mock session data',
      });
      return app.httpRequest()
        .get('/session')
        .expect({
          user: {
            foo: 'bar',
          },
          hello: 'egg mock session data',
        });
    });

    it('should mock restore', () => {
      return app.httpRequest()
        .get('/session')
        .expect({});
    });
  });
});
