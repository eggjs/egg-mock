'use strict';

const path = require('path');
const assert = require('power-assert');
const mm = require('..');

describe('test/mock_session.test.js', function() {

  let app;
  before(function(done) {
    app = mm.app({
      baseDir: 'demo',
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    app.ready(done);
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should mock session', function() {
    app.mockSession({
      user: {
        foo: 'bar',
      },
    });
    const ctx = app.mockContext();

    assert(ctx.session.user.foo === 'bar');
  });
});
