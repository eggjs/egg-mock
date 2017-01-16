'use strict';

const assert = require('assert');
const mm = require('..');

describe('test/mock_context.test.js', () => {

  let app;
  before(done => {
    app = mm.app({
      baseDir: 'demo',
    });
    app.ready(done);
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should work with bucLogin', () => {
    const ctx = app.mockContext({
      user: {
        foo: 'bar',
      },
    });

    assert(ctx.user.foo === 'bar');
  });
});
