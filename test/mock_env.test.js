'use strict';

const path = require('path');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_env.test.js', function() {
  afterEach(mm.restore);

  let app;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    return app.ready();
  });

  it('should mock env succes', function() {
    app.mockEnv('prod');
    app.config.env.should.equal('prod');
    app.config.serverEnv.should.equal('prod');
  });
});
