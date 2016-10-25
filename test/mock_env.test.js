'use strict';

const path = require('path');
const assert = require('power-assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_env.test.js', function() {

  let app;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should mock env succes', function() {
    app.mockEnv('prod');
    assert(app.config.env === 'prod');
    assert(app.config.serverEnv === 'prod');
  });
});
