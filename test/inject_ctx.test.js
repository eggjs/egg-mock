const coffee = require('coffee');
const path = require('path');

describe('test/inject_ctx.test.js', () => {
  const eggBinFile = require.resolve('egg-bin//dist/bin/cli');

  it('should inject ctx to runner', async () => {
    const fixture = path.join(__dirname, 'fixtures/tegg-app');

    await coffee.fork(eggBinFile, [
      'test',
      '-r', require.resolve('../register'),
    ], {
      cwd: fixture,
      env: {
        EGG_FRAMEWORK: require.resolve('egg'),
      },
    })
      // .debug()
      .expect('code', 0)
      .expect('stdout', /\d+ passing/)
      .end();
  });

  it('should inject ctx to runner with setGetAppCallback', async () => {
    const fixture = path.join(__dirname, 'fixtures/setup-app');

    await coffee.fork(eggBinFile, [
      'test',
      '-r', require.resolve('../register'),
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

    await coffee.fork(eggBinFile, [
      'test',
      '-r', require.resolve('../register'),
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
    //   test/inject_ctx.test.js
    //     run suite
    //   1) "before all" hook: beforeAll in "{root}"
    //   2) "after all" hook: afterAll in "{root}"
    //   0 passing (7ms)
    //   2 failing
    //   1) "before all" hook: beforeAll in "{root}":
    //      Error: mock get app failed
    //   2) "after all" hook: afterAll in "{root}":
    //      Error: mock get app failed
    it('get app error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/get-app-failed');

      await coffee.fork(eggBinFile, [
        'test',
        '-r', require.resolve('../register'),
      ], {
        cwd: fixture,
        env: {
          EGG_FRAMEWORK: require.resolve('egg'),
        },
      })
        // .debug()
        .expect('code', 1)
        .expect('stdout', /"before all" hook: beforeAll in "{root}"/)
        .end();
    });

    //   test/inject_ctx.test.js
    //     run suite
    //   1) "before all" hook: egg-mock-mock-ctx-failed in "{root}"
    //   0 passing (4ms)
    //   1 failing
    //   1) "before all" hook: egg-mock-mock-ctx-failed in "{root}":
    //      Error: mock create context failed
    it('create context error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/create-context-failed');

      await coffee.fork(eggBinFile, [
        'test',
        '-r', require.resolve('../register'),
      ], {
        cwd: fixture,
        env: {
          EGG_FRAMEWORK: require.resolve('egg'),
        },
      })
        // .debug()
        .expect('code', 1)
        .expect('stdout', /Error: mock create context failed/)
        .end();
    });

    //   1) "before all" hook: beforeAll in "{root}"
    //   2) "after all" hook: afterAll in "{root}"
    //   0 passing (432ms)
    //   2 failing
    //   1) "before all" hook: beforeAll in "{root}":
    //      Error: mock app ready failed
    //   2) "after all" hook: afterAll in "{root}":
    //      Error: mock app ready failed
    it('app.ready error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/app-ready-failed');

      await coffee.fork(eggBinFile, [
        'test',
        '-r', require.resolve('../register'),
      ], {
        cwd: fixture,
        env: {
          EGG_FRAMEWORK: require.resolve('egg'),
        },
      })
        // .debug()
        .expect('code', 1)
        .expect('stdout', /mock app ready failed/)
        .end();
    });
  });

  describe('run test', () => {
    //  test case get app error
    //     1) should not print
    //   0 passing (5ms)
    //   1 failing
    //   1) test case get app error
    //        should not print:
    //      Error: mock get app failed
    it('get app error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/test-case-get-app-failed');

      await coffee.fork(eggBinFile, [
        'test',
        '-r', require.resolve('../register'),
      ], {
        cwd: fixture,
        env: {
          EGG_FRAMEWORK: require.resolve('egg'),
        },
      })
        // .debug()
        .expect('code', 1)
        .expect('stdout', /Error: mock get app failed/)
        .end();
    });

    //   test case create context error
    //     1) should not print
    //   0 passing (7ms)
    //   1 failing
    //   1) test case create context error
    //        should not print:
    //      Error: mock create context failed
    //       at Object.mockContextScope (test/index.test.js:12:15)
    //       at next (/Users/killa/workspace/egg-mock/lib/inject_context.js:107:30)
    it('create context error should failed', async () => {
      const fixture = path.join(__dirname, 'fixtures/test-case-create-context-failed');

      await coffee.fork(eggBinFile, [
        'test',
        '-r', require.resolve('../register'),
      ], {
        cwd: fixture,
        env: {
          EGG_FRAMEWORK: require.resolve('egg'),
        },
      })
        // .debug()
        .expect('code', 1)
        .expect('stdout', /Error: mock create context failed/)
        .end();
    });
  });
});
