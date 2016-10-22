'use strict';

const path = require('path');
const request = require('supertest');
const assert = require('power-assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_service.test.js', function() {

  let app;
  before(function* () {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    yield app.ready();
  });
  afterEach(mm.restore);

  it('should return from service', function(done) {
    request(app.callback())
    .get('/service')
    .expect({
      foo1: 'bar',
      foo2: 'bar',
      foo3: 'bar',
      thirdService: 'third',
    }, done);
  });

  it('should return from service when mock with data', function(done) {
    app.mockService('foo', 'get', 'foo');
    app.mockService('foo', 'getSync', 'foo');
    app.mockService('bar.foo', 'get', 'foo');
    request(app.callback())
    .get('/service')
    .expect({
      foo1: 'foo',
      foo2: 'foo',
      foo3: 'foo',
      thirdService: 'third',
    }, done);
  });

  it('should support old service format', function(done) {
    app.mockService('old', 'test', 'test');
    request(app.callback())
    .get('/service/old')
    .expect('test', done);
  });

  it('should throw', function() {
    assert.throws(() => {
      app.mockService('foo', 'not_exist', 'foo');
    }, 'property not_exist in original object must be function');
  });

  it('should return from service when mock with generator', function(done) {
    app.mockService('foo', 'get', function* () {
      return 'foo';
    });
    request(app.callback())
    .get('/service')
    .expect({
      foo1: 'foo',
      foo2: 'bar',
      foo3: 'bar',
      thirdService: 'third',
    }, done);
  });

  it('should return from service when mock with 3 level', function(done) {
    app.mockService('foo', 'get', '1 level service');
    app.mockService('bar.foo', 'get', '2 level service');
    app.mockService('third.bar.foo', 'get', '3 level service');
    request(app.callback())
    .get('/service')
    .expect({
      foo1: '1 level service',
      foo2: '2 level service',
      foo3: 'bar',
      thirdService: '3 level service',
    }, done);

  });

  it('should return from service when mock with error', function(done) {
    app.mockService('foo', 'get', function* () {
      throw new Error('mock service foo.get error');
    });
    request(app.callback())
    .get('/service')
    .expect(/mock service foo\.get error/)
    .expect(500, done);
  });

  describe('app.mockServiceError()', function() {
    it('should default mock error', function(done) {
      app.mockServiceError('foo', 'get');
      request(app.callback())
      .get('/service')
      .expect(/mock get error/)
      .expect(500, done);
    });

    it('should create custom mock error with string', function(done) {
      app.mockServiceError('foo', 'get', 'mock service foo.get error1');
      request(app.callback())
      .get('/service')
      .expect(/mock service foo\.get error1/)
      .expect(500, done);
    });

    it('should return custom mock error', function(done) {
      app.mockServiceError('foo', 'get', new Error('mock service foo.get error2'));
      request(app.callback())
      .get('/service')
      .expect(/mock service foo\.get error2/)
      .expect(500, done);
    });
  });

});
