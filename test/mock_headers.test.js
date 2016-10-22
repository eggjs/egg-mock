'use strict';

const request = require('supertest');
const path = require('path');
const assert = require('power-assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_headers.test.js', function() {

  afterEach(mm.restore);

  let app;
  before(function() {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    return app.ready();
  });

  it('should not exists without mock', function(done) {
    app.mockContext();

    request(app.callback())
    .get('/header')
    .expect(function(res) {
      assert(res.body.header === '');
    })
    .expect(200, done);
  });

  it('should mock headers', function(done) {
    app.mockContext();
    app.mockHeaders({
      customheader: 'customheader',
    });
    request(app.callback())
    .get('/header')
    .expect(function(res) {
      assert(res.body.header === 'customheader');
    })
    .expect(200, done);
  });

  it('should mock headers that is uppercase', function(done) {
    app.mockContext();
    app.mockHeaders({
      Customheader: 'customheader',
    });
    request(app.callback())
    .get('/header')
    .expect(function(res) {
      assert(res.body.header === 'customheader');
    })
    .expect(200, done);
  });
});
