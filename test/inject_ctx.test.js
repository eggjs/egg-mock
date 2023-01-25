const coffee = require('coffee');
const path = require('path');

describe('test/inject_ctx.test.js', () => {
  it('should inject ctx to runner', async () => {
    const fixture = path.join(__dirname, 'fixtures/tegg-app');

    await coffee.fork(require.resolve('egg-bin/bin/egg-bin'), [
      'test',
      '-r', require.resolve('../register'),
      '--full-trace',
    ], {
      cwd: fixture,
      env: {
        EGG_FRAMEWORK: require.resolve('egg'),
      },
    })
      .debug()
      .expect('code', 0)
      .expect('stdout', /9 passing/)
      .end();
  });

  it('should inject ctx to runner with setGetAppCallback', async () => {
    const fixture = path.join(__dirname, 'fixtures/setup-app');

    await coffee.fork(require.resolve('egg-bin/bin/egg-bin'), [
      'test',
      '-r', require.resolve('../register'),
      '--full-trace',
    ], {
      cwd: fixture,
    })
      .debug()
      .expect('code', 0)
      // .expect('stdout', /9 passing/)
      .end();
  });
});
