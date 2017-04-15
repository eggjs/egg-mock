'use strict';

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
  });
});
