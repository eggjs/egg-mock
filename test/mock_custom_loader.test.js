'use strict';

const path = require('path');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe.only('test/mock_custom_loader.js', () => {
  let app;
  before(async () => {
    app = mm.app({
      baseDir: path.join(fixtures, 'custom-loader'),
    });
    await app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should return success', async () => {
    await app.httpRequest()
      .get('/users/popomore')
      .expect({
        adapter: 'docker',
        repository: 'user',
      })
      .expect(200);
  });

  it('should return when mock with data', async () => {
    app.mockRepository('user', 'get', 'mock');
    app.mockAdapter('docker', 'inspectDocker', 'mock');
    await app.httpRequest()
      .get('/users/popomore')
      .expect({
        adapter: 'mock',
        repository: 'mock',
      })
      .expect(200);
  });

});
