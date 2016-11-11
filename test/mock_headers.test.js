'use strict';

const request = require('supertest');
const path = require('path');
const assert = require('power-assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_headers.test.js', () => {

  afterEach(mm.restore);

  let app;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should not exists without mock', done => {
    app.mockContext();

    request(app.callback())
    .get('/header')
    .expect(function(res) {
      assert(res.body.header === '');
    })
    .expect(200, done);
  });

  it('should mock headers', done => {
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

  it('should mock headers that is uppercase', done => {
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
