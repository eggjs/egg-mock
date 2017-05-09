'use strict';

const mm = require('..');

describe('test/mock_cluster_restore.test.js', () => {
  let app;
  before(() => {
    app = mm.cluster({
      baseDir: 'demo',
    });
    return app.ready();
  });
  after(() => app.close());

  it('should mock cluster restore work', function* () {
    app.mockSession({
      user: {
        foo: 'bar',
      },
      hello: 'egg mock session data',
    });
    yield app.httpRequest()
      .get('/session')
      .expect({
        user: {
          foo: 'bar',
        },
        hello: 'egg mock session data',
      });

    mm.restore();
    yield app.httpRequest()
      .get('/session')
      .expect({});
  });
});
