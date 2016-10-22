'use strict';

const path = require('path');
const request = require('supertest');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_csrf.test.js', function() {

  let app;
  before(function() {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
  });

  it('should work', function(done) {
    app.mockCsrf();
    request(app.callback())
    .post('/')
    .expect(200)
    .expect('done', done);
  });
});
