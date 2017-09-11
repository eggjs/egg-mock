'use strict';

const assert = require('assert');
const mm = require('..');

describe('test/mock_httpclient.test.js', () => {
  describe('app mode', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'request',
      });
      return app.ready();
    });
    after(() => app.close());
    afterEach(mm.restore);

    it('should test app with request', () => {
      return app.httpRequest()
        .get('/')
        .expect(200)
        .expect('hello world');
    });

    it('should test app with request on pathFor', () => {
      return app.httpRequest()
        .get('home')
        .expect(200)
        .expect('hello world');
    });

    it('should GET session path work', () => {
      return app.httpRequest()
        .get('session')
        .expect(200)
        .expect('hello session');
    });

    it('should GET wrong pathFor name throw error', () => {
      try {
        app.httpRequest()
          .get('session-404')
          .expect(200)
          .expect('hello world');
        throw new Error('should not run this');
      } catch (err) {
        assert(err);
        assert(err.message === 'Can\'t find router:session-404, please check your \'app/router.js\'');
      }
    });
  });

  describe('cluster mode', () => {
    let app;
    before(() => {
      app = mm.cluster({
        baseDir: 'request',
      });
      return app.ready();
    });
    after(() => app.close());
    afterEach(mm.restore);

    it('should test app with request', () => {
      return app.httpRequest()
        .get('/')
        .expect(200)
        .expect('hello world');
    });

    it('should test app with request on pathFor', () => {
      return app.httpRequest()
        .get('home')
        .expect(200)
        .expect('hello world');
    });

    it('should GET session path work', () => {
      return app.httpRequest()
        .get('session')
        .expect(200)
        .expect('hello session');
    });

    it('should GET wrong pathFor name throw error', () => {
      try {
        app.httpRequest()
          .get('session-404')
          .expect(200)
          .expect('hello world');
        throw new Error('should not run this');
      } catch (err) {
        assert(err);
        assert(err.message === 'Can\'t find router:session-404, please check your \'app/router.js\'');
      }
    });
  });
});
