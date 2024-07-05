const path = require('node:path');
const { strict: assert } = require('node:assert');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/mock_env.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should mock env success', () => {
    app.mockEnv('prod');
    assert.equal(app.config.env, 'prod');
    assert.equal(app.config.serverEnv, 'prod');
  });

  it('should keep mm.restore execute in the current event loop', async () => {
    mm.restore();
    assert.equal(app.config.env, 'unittest');
    assert.equal(app.config.serverEnv, undefined);

    app.mockEnv('prod');
    assert.equal(app.config.env, 'prod');
    assert.equal(app.config.serverEnv, 'prod');

    await sleep(1);
    assert.equal(app.config.env, 'prod');
    assert.equal(app.config.serverEnv, 'prod');

    mm.restore();
    assert.equal(app.config.env, 'unittest');
    assert.equal(app.config.serverEnv, undefined);
  });
});

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
