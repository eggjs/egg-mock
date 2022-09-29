'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { sleep } = require('../lib/utils');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_cluster_restore.test.js', () => {
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

  describe('handle uncaughtException', () => {
    let app;
    before(() => {
      app = mm.cluster({
        baseDir: 'apps/app-throw',
        coverage: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should handle uncaughtException and log it', function* () {
      yield app.httpRequest()
        .get('/throw')
        .expect('foo')
        .expect(200);

      yield sleep(1100);
      const logfile = path.join(fixtures, 'apps/app-throw/logs/app-throw/common-error.log');
      const body = fs.readFileSync(logfile, 'utf8');
      assert(body.includes('ReferenceError: a is not defined (uncaughtException throw'));
    });
  });
});
