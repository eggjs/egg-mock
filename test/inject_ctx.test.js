const coffee = require('coffee');
const path = require('path');

describe.only('test/inject_ctx.test.js', () => {
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
      .expect('stdout', /10 passing/)
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
      // .debug()
      .expect('code', 0)
      // .expect('stdout', /9 passing/)
      .end();
  });

  it('hook/case error should failed', async () => {
    const fixture = path.join(__dirname, 'fixtures/failed-app');

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
      // .debug()
      .expect('stdout', /after error test case should print/)
      .expect('stdout', /afterEach error test case should print/)
      .expect('stdout', /"before all" hook for "should not print"/)
      .expect('stdout', /"after all" hook for "should print"/)
      .expect('stdout', /"before each" hook for "should not print"/)
      .expect('stdout', /"after each" hook for "should print"/)
      .expect('stdout', /3 passing/)
      // 1 after + 1 afterEach + 1 before + 1 beforeEach + 1 test case
      .expect('stdout', /5 failing/)
      .expect('code', 1)
      .end();
  });

  describe('run suite', () => {
    it('get app error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/get-app-failed');

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
        // .debug()
        .expect('code', 1)
        .expect('stdout', /get app for "root suite": mock get app failed/)
        .end();
    });

    it('create context error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/create-context-failed');

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
        // .debug()
        .expect('code', 1)
        .expect('stdout', /inject context for "root suite": mock create context failed/)
        .end();
    });
  });

  describe('run test', () => {
    it('get app error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/test-case-get-app-failed');

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
        // .debug()
        .expect('code', 1)
        .expect('stdout', /get app for "test case get app error - should not print": mock get app failed/)
        .end();
    });

    it('create context error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/test-case-create-context-failed');

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
        // .debug()
        .expect('code', 1)
        .expect('stdout', /create context for "test case create context error" error: mock create context failed/)
        .end();
    });
  });
});
