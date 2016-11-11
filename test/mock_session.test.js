'use strict';

const assert = require('power-assert');
const mm = require('..');

describe('test/mock_session.test.js', () => {

  let app;
  before(done => {
    app = mm.app({
      baseDir: 'demo',
    });
    app.ready(done);
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should mock session', () => {
    app.mockSession({
      user: {
        foo: 'bar',
      },
    });
    const ctx = app.mockContext();

    assert(ctx.session.user.foo === 'bar');
  });
});
