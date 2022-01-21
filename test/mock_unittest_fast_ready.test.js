'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_unittest_fast_ready.test.js', () => {

  let app;
  afterEach(async () => {
    mm.restore();
    await app.close();
  });

  it('should unittestFastReady=false when process.env.EGG_UNITTEST_FAST_READY not match', async () => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
    await app.ready();
    assert(app.unittestFastReady === false);
  });

  it('should unittestFastReady=true when process.env.EGG_UNITTEST_FAST_READY=true', async () => {
    mm(process.env, 'EGG_UNITTEST_FAST_READY', 'true');
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
    await app.ready();
    assert(app.unittestFastReady === true);
  });
});
