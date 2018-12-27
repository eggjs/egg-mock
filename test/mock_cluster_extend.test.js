'use strict';

const assert = require('assert');
const mm = require('..');

describe('test/mock_cluster_extend.test.js', () => {
  let app;
  before(() => {
    app = mm.cluster({
      baseDir: 'demo',
      coverage: false,
    });
    return app.ready();
  });
  after(() => app.close());

  afterEach(mm.restore);

  it('should mock cluster with result', function* () {
    let result = yield app.mockDevice({ name: 'egg' });
    assert.deepEqual(result, { name: 'egg', mock: true });

    result = yield app.mockGenerator({ name: 'egg generator' });
    assert.deepEqual(result, { name: 'egg generator', mock: true });

    result = yield app.mockPromise({ name: 'egg promise' });
    assert.deepEqual(result, { name: 'egg promise', mock: true });
  });
});
