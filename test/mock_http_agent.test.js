'use strict';

// const assert = require('assert');
const mm = require('..');

describe('test/mock_http_agent.test.js', () => {
  describe('app mode', () => {
    let app;
    let agent;
    before(() => {
      app = mm.app({
        baseDir: 'http-agent',
      });
      return app.ready().then(() => {
        agent = app.httpAgent({});
      });
    });
    after(() => app.close());
    afterEach(mm.restore);

    it('should not cookies', function() {
      return agent
        .get('/return')
        .expect(':(');
    });

    it('should save cookies', function() {
      return agent
        .get('/')
        .expectHeader('set-cookie')
        .expect(200);
    });

    it('should send cookies', function() {
      return agent
        .get('/return')
        .expect('hey');
    });
  });
});
