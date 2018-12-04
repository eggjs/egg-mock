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
    const result = yield app.mockDevice({ name: 'egg' });
    assert.deepEqual(result, { name: 'egg', mock: true });
  });
});
