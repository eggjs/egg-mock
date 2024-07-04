'use strict';

const request = require('supertest');
const path = require('path');
const assert = require('assert');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/app.test.js', () => {
  afterEach(mm.restore);

  // test mm.app
  call('app');
  // test mm.cluster
  call('cluster');

  it('should alias app.agent to app._agent', async () => {
    const baseDir = path.join(fixtures, 'app');
    const app = mm.app({
      baseDir,
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    await app.ready();
    assert(app.agent === app._agent);
    assert(app.agent.app === app._app);
  });

  it('should not use cache when app is closed', async () => {
    const baseDir = path.join(fixtures, 'app');
    const app1 = mm.app({
      baseDir,
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    await app1.ready();
    await app1.close();

    const app2 = mm.app({
      baseDir,
      customEgg: path.join(__dirname, '../node_modules/egg'),
    });
    await app2.ready();
    await app2.close();

    assert(app1 !== app2);
  });

  it('should auto find framework when egg.framework exists on package.json', async () => {
    const baseDir = path.join(fixtures, 'yadan_app');
    const app = mm.app({
      baseDir,
    });
    await app.ready();
    assert(app.config.foobar === 'yadan');
    await app.close();
  });

  it('should emit server event on app without superTest', async () => {
    const baseDir = path.join(fixtures, 'server');
    const app = mm.app({
      baseDir,
    });
    await app.ready();
    assert(app.server);
    assert(app.emitServer);
    await app.close();
  });

  it('support options.beforeInit', async () => {
    const baseDir = path.join(fixtures, 'app');
    const app = mm.app({
      baseDir,
      customEgg: path.join(__dirname, '../node_modules/egg'),
      cache: false,
      beforeInit(instance) {
        return new Promise(resolve => {
          setTimeout(() => {
            instance.options.test = 'abc';
            resolve();
          }, 100);
        });
      },
    });
    await app.ready();
    assert(!app.options.beforeInit);
    assert(app.options.test === 'abc');
  });

  it('should emit error when load Application fail', done => {
    const baseDir = path.join(fixtures, 'app-fail');
    const app = mm.app({ baseDir, cache: false });
    app.once('error', err => {
      assert(/load error/.test(err.message));
      done();
    });
  });

  it('should FrameworkErrorformater work during app boot', async () => {
    let logMsg;
    let catchErr;
    mm(process.stderr, 'write', msg => {
      logMsg = msg;
    });
    const app = mm.app({ baseDir: path.join(fixtures, 'app-boot-error') });
    try {
      await app.ready();
    } catch (err) {
      catchErr = err;
    }

    assert(catchErr.code === 'customPlugin_99');
    assert(/framework\.CustomError\: mock error \[ https\:\/\/eggjs\.org\/zh-cn\/faq\/customPlugin_99 \]/.test(logMsg));
  });

  it('should FrameworkErrorformater work during app boot ready', async () => {
    let logMsg;
    let catchErr;
    mm(process.stderr, 'write', msg => {
      logMsg = msg;
    });
    const app = mm.app({ baseDir: path.join(fixtures, 'app-boot-ready-error') });
    try {
      await app.ready();
    } catch (err) {
      catchErr = err;
    }

    assert(catchErr.code === 'customPlugin_99');
    assert(/framework\.CustomError\: mock error \[ https\:\/\/eggjs\.org\/zh-cn\/faq\/customPlugin_99 \]/.test(logMsg));
  });
});

function call(method) {
  let app;
  describe(`mm.${method}()`, () => {
    before(done => {
      const baseDir = path.join(fixtures, 'app');
      mm(process, 'cwd', () => baseDir);
      app = mm[method]({
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/')
        .expect('foo')
        .expect(200, done);
    });

    it('should emit server event on app', () => {
      return app.httpRequest()
        .get('/keepAliveTimeout')
        .expect(200)
        .expect({
          keepAliveTimeout: 5000,
        });
    });

    it('should app.expectLog(), app.notExpectLog() work', async () => {
      await app.httpRequest()
        .get('/logger')
        .expect(200)
        .expect({
          ok: true,
        });
      app.expectLog('[app.expectLog() test] ok');
      app.expectLog('[app.expectLog() test] ok', 'logger');
      app.expectLog('[app.expectLog(coreLogger) test] ok', 'coreLogger');

      app.notExpectLog('[app.notExpectLog() test] fail');
      app.notExpectLog('[app.notExpectLog() test] fail', 'logger');
      app.notExpectLog('[app.notExpectLog(coreLogger) test] fail', 'coreLogger');

      if (method === 'app') {
        app.expectLog(/\[app\.expectLog\(\) test\] ok/);
        app.expectLog(/\[app\.expectLog\(\) test\] ok/, app.logger);
        app.expectLog('[app.expectLog(coreLogger) test] ok', app.coreLogger);
        app.expectLog(/\[app\.expectLog\(coreLogger\) test\] ok/, 'coreLogger');

        app.notExpectLog(/\[app\.notExpectLog\(\) test\] fail/);
        app.notExpectLog(/\[app\.notExpectLog\(\) test\] fail/, app.logger);
        app.notExpectLog('[app.notExpectLog(coreLogger) test] fail', app.coreLogger);
        app.notExpectLog(/\[app\.notExpectLog\(coreLogger\) test\] fail/, 'coreLogger');
      }

      try {
        app.expectLog('[app.expectLog(coreLogger) test] ok');
        throw new Error('should not run this');
      } catch (err) {
        assert(err.message.includes('Can\'t find String:"[app.expectLog(coreLogger) test] ok" in '));
        assert(err.message.includes('app-web.log'));
      }

      try {
        app.notExpectLog('[app.expectLog() test] ok');
        throw new Error('should not run this');
      } catch (err) {
        assert(err.message.includes('Find String:"[app.expectLog() test] ok" in '));
        assert(err.message.includes('app-web.log'));
      }
    });

    it('should app.mockLog() then app.expectLog() work', async () => {
      app.mockLog();
      app.mockLog('logger');
      app.mockLog('coreLogger');
      await app.httpRequest()
        .get('/logger')
        .expect(200)
        .expect({
          ok: true,
        });
      app.expectLog('[app.expectLog() test] ok');
      app.expectLog('[app.expectLog() test] ok', 'logger');
      app.expectLog('[app.expectLog(coreLogger) test] ok', 'coreLogger');

      app.notExpectLog('[app.notExpectLog() test] fail');
      app.notExpectLog('[app.notExpectLog() test] fail', 'logger');
      app.notExpectLog('[app.notExpectLog(coreLogger) test] fail', 'coreLogger');

      if (method === 'app') {
        app.expectLog(/\[app\.expectLog\(\) test\] ok/);
        app.expectLog(/\[app\.expectLog\(\) test\] ok/, app.logger);
        app.expectLog('[app.expectLog(coreLogger) test] ok', app.coreLogger);
        app.expectLog(/\[app\.expectLog\(coreLogger\) test\] ok/, 'coreLogger');

        app.notExpectLog(/\[app\.notExpectLog\(\) test\] fail/);
        app.notExpectLog(/\[app\.notExpectLog\(\) test\] fail/, app.logger);
        app.notExpectLog('[app.notExpectLog(coreLogger) test] fail', app.coreLogger);
        app.notExpectLog(/\[app\.notExpectLog\(coreLogger\) test\] fail/, 'coreLogger');
      }

      try {
        app.expectLog('[app.expectLog(coreLogger) test] ok');
        throw new Error('should not run this');
      } catch (err) {
        assert(err.message.includes('Can\'t find String:"[app.expectLog(coreLogger) test] ok" in '));
        assert(err.message.includes('app-web.log'));
      }

      try {
        app.notExpectLog('[app.expectLog() test] ok');
        throw new Error('should not run this');
      } catch (err) {
        assert(err.message.includes('Find String:"[app.expectLog() test] ok" in '));
        assert(err.message.includes('app-web.log'));
      }

      if (method === 'app') {
        assert(app.logger._mockLogs);
        assert(app.coreLogger._mockLogs);
        await mm.restore();
        assert(!app.logger._mockLogs);
        assert(!app.coreLogger._mockLogs);
      }
    });

    it('should app.mockLog() don\'t read from file', async () => {
      await app.httpRequest()
        .get('/logger')
        .expect(200)
        .expect({
          ok: true,
        });
      app.expectLog('INFO');
      app.mockLog();
      app.notExpectLog('INFO');
    });

    it('should request with ua', async () => {
      await app.httpRequest()
        .get('/ua')
        .expect(200)
        .expect(/egg-mock\//);
    });
  });

  describe(`mm.${method}({ baseDir, plugin=string })`, () => {
    const pluginDir = path.join(fixtures, 'fooPlugin');
    before(done => {
      mm(process, 'cwd', () => pluginDir);
      app = mm[method]({
        baseDir: path.join(__dirname, 'fixtures/apps/foo'),
        plugin: 'fooPlugin',
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/')
        .expect({
          fooPlugin: true,
        })
        .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, plugin=true })`, () => {
    const pluginDir = path.join(fixtures, 'fooPlugin');
    before(done => {
      mm(process, 'cwd', () => pluginDir);
      app = mm[method]({
        baseDir: path.join(__dirname, 'fixtures/apps/foo'),
        plugin: true,
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/')
        .expect({
          fooPlugin: true,
        })
        .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, plugins })`, () => {
    before(done => {
      app = mm[method]({
        baseDir: path.join(__dirname, 'fixtures/apps/foo'),
        plugins: {
          fooPlugin: {
            enable: true,
            path: path.join(fixtures, 'fooPlugin'),
          },
        },
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/')
        .expect({
          fooPlugin: true,
        })
        .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, customEgg=fullpath})`, () => {
    before(done => {
      app = mm[method]({
        baseDir: 'apps/barapp',
        customEgg: path.join(fixtures, 'bar'),
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/')
        .expect({
          foo: 'bar',
          foobar: 'bar',
        })
        .expect(200, done);
    });
  });


  describe(`mm.${method}({ baseDir, customEgg=true})`, () => {
    before(done => {
      mm(process, 'cwd', () => {
        return path.join(fixtures, 'bar');
      });
      app = mm[method]({
        baseDir: path.join(fixtures, 'apps/barapp'),
        customEgg: true,
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/')
        .expect({
          foo: 'bar',
          foobar: 'bar',
        })
        .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, cache=true })`, () => {
    let app1;
    let app2;
    before(done => {
      app1 = mm[method]({
        baseDir: 'cache',
        coverage: false,
      });
      app1.ready(done);
    });
    before(done => {
      app2 = mm[method]({
        baseDir: 'cache',
        coverage: false,
      });
      app2.ready(done);
    });
    after(async () => {
      await app1.close();
      await app2.close();
    });

    it('should equal', () => {
      assert(app1 === app2);
    });
  });
}
