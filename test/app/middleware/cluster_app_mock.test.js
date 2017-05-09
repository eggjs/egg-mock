'use strict';

const assert = require('assert');
const mm = require('../../..');

describe('test/app/middleware/cluster_app_mock.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'demo',
    });
    return app.ready();
  });
  after(() => app.close());

  afterEach(mm.restore);

  it('should return 422 when method missing', () => {
    return app.httpRequest()
      .post('/__egg_mock_call_function')
      .send({})
      .expect(422)
      .expect({
        success: false,
        error: 'Missing method',
      });
  });

  it('should return 422 when args is not Array', () => {
    return app.httpRequest()
      .post('/__egg_mock_call_function')
      .send({ method: 'foo', args: 'hi' })
      .expect(422)
      .expect({
        success: false,
        error: 'args should be an Array instance',
      });
  });

  it('should return 422 when method is not exists on app', () => {
    return app.httpRequest()
      .post('/__egg_mock_call_function')
      .send({ method: 'not_exists_method', args: [] })
      .expect(422)
      .expect({
        success: false,
        error: 'method "not_exists_method" not exists on app',
      });
  });

  it('should recover error instance', function* () {
    let called;
    let callError;
    mm(app, 'foo', (a, err) => { called = true; callError = err; });

    const err = {
      __egg_mock_type: 'error',
      name: 'FooError',
      message: 'foo error fire',
      stack: 'error stack',
      foo: 'bar',
    };
    yield app.httpRequest()
      .post('/__egg_mock_call_function')
      .send({ method: 'foo', args: [ 1, err ] })
      .expect(200)
      .expect({
        success: true,
      });

    assert(called);
    assert(callError.name === 'FooError');
    assert(callError.stack === 'error stack');
    assert(callError.message === 'foo error fire');
    assert(callError.foo === 'bar');
  });
});
