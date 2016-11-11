'use strict';

const path = require('path');
const request = require('supertest');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_csrf.test.js', () => {

  let app;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should work', done => {
    app.mockCsrf();
    request(app.callback())
    .post('/')
    .expect(200)
    .expect('done', done);
  });
});
