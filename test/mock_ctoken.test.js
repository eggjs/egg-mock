'use strict';

const path = require('path');
const request = require('supertest');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_ctoken.test.js', function() {
  let app;
  before(function() {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    return app.ready();
  });
  afterEach(function() {
    app.mockRestore();
  });

  it('should return without ctoken', function(done) {
    app.mockCtoken();

    request(app.callback())
    .get('/ctoken.json')
    .set('customheader', 'customheader')
    .set('Cookie', 'customcookie=customcookie;')
    .expect({
      cookies: 'customcookie',
      header: 'customheader',
    }, done);
  });

});
