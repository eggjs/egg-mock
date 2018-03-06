'use strict';

const path = require('path');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe.only('test/httpRequest.test.js', () => {

  afterEach(mm.restore);

  describe('app', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: path.join(fixtures, 'demo'),
        cache: false,
        coverage: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should support httpRequest', () => {
      return app.httpRequest().get('/hello').expect('hi');
    });

    it('should support httpRequest(\'/hello\')', () => {
      return app.httpRequest('/hello').expect('hi');
    });
  });

  describe('cluster', () => {
    let app;
    before(() => {
      app = mm.cluster({
        baseDir: path.join(fixtures, 'demo'),
        cache: false,
        coverage: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should support httpRequest', () => {
      return app.httpRequest().get('/hello').expect('hi');
    });

    it('should support httpRequest(\'/hello\')', () => {
      return app.httpRequest('/hello').expect('hi');
    });
  });
});
