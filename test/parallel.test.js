const path = require('path');
const agentRegister = require('../register');

describe('test/parallel.test.js', () => {
  before(async () => {
    await agentRegister.mochaGlobalSetup();
    process.env.ENABLE_MOCHA_PARAELLEL = 'true';
    process.env.AUTO_AGENT = 'true';
    process.env.EGG_BASE_DIR = path.join(__dirname, './fixtures/apps/foo');
  });

  after(async () => {
    await agentRegister.mochaGlobalTeardown();
    delete process.env.ENABLE_MOCHA_PARAELLEL;
    delete process.env.AUTO_AGENT;
    delete process.env.EGG_BASE_DIR;
  });

  it('should work', async () => {
    const { app } = require('../bootstrap');
    await app.ready();
    await app.httpRequest()
      .get('/')
      .expect(200)
      .expect('foo');
    await app.close();
  });
});
