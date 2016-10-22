'use strict';

const path = require('path');
const assert = require('power-assert');
const mm = require('..');

describe('test/mock_context.test.js', function() {

  let app;
  before(function(done) {
    app = mm.app({
      baseDir: 'demo',
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    app.ready(done);
  });
  afterEach(mm.restore);

  it('should work with bucLogin', function() {
    const ctx = app.mockContext({
      user: {
        foo: 'bar',
      },
    });

    assert(ctx.user.foo === 'bar');
  });
});
