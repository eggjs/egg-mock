'use strict';

const path = require('path');
const assert = require('assert');
const request = require('supertest');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/cluster.test.js', () => {

  afterEach(mm.restore);

  describe('normal', () => {
    let app;
    before(() => {
      app = mm.cluster({
        baseDir: path.join(fixtures, 'demo'),
        cache: false,
        coverage: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should have members', function* () {
      assert(app.callback() === app);
      assert(app.listen() === app);
      yield app.ready();
      assert(app.process);
    });

    it('should throw error when mock function not exists', () => {
      assert.throws(() => {
        app.mockNotExists();
      }, /method "mockNotExists" not exists on app/);
    });
  });

  describe('cluster with fullpath baseDir', () => {
    let app;
    before(done => {
      app = mm.cluster({
        baseDir: path.join(fixtures, 'demo'),
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/hello')
        .expect('hi')
        .expect(200, done);
    });
  });

  describe('cluster with shortpath baseDir', () => {
    let app;
    before(done => {
      app = mm.cluster({
        baseDir: 'demo',
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', done => {
      request(app.callback())
        .get('/hello')
        .expect('hi')
        .expect(200, done);
    });
  });

  describe('cluster with customEgg=string', () => {
    let app;
    before(done => {
      app = mm.cluster({
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

  describe('cluster with customEgg=true', () => {
    let app;
    before(done => {
      mm(process, 'cwd', () => {
        return path.join(fixtures, 'bar');
      });
      app = mm.cluster({
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

  describe('cluster with cache', () => {
    let app1;
    let app2;
    afterEach(() => {
      const promises = [];
      app1 && promises.push(app1.close());
      app2 && promises.push(app2.close());
      return Promise.all(promises);
    });

    it('should return cached cluster app', function* () {
      app1 = mm.cluster({
        baseDir: 'demo',
        coverage: false,
      });
      yield app1.ready();

      app2 = mm.cluster({
        baseDir: 'demo',
        coverage: false,
      });
      yield app2.ready();

      assert(app1 === app2);
    });

    it('should return new app if cached app has been closed', function* () {
      app1 = mm.cluster({
        baseDir: 'demo',
        coverage: false,
      });
      yield app1.ready();
      yield app1.close();

      app2 = mm.cluster({
        baseDir: 'demo',
        coverage: false,
      });
      yield app2.ready();

      assert(app2 !== app1);
    });

  });

  describe('cluster with eggPath', () => {
    let app;
    after(() => app.close());

    it('should get eggPath', done => {
      app = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, 'fixtures/chair'),
        eggPath: '/path/to/eggPath',
        cache: false,
        coverage: false,
      });
      app
        .debug()
        .expect('stdout', /\/path\/to\/eggPath/)
        .end(done);
    });
  });

  describe('cluster with workers', () => {
    let app;
    after(() => app.close());

    it('should get 2 workers', done => {
      app = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, 'fixtures/chair'),
        workers: 2,
        cache: false,
        coverage: false,
      });
      app.debug();
      app.expect('stdout', /app_worker#1:/)
        .expect('stdout', /app_worker#2:/)
        .end(done);
    });
  });

  describe('cluster with opts.customEgg', () => {
    let app;
    after(() => app.close());

    it('should pass execArgv', done => {
      app = mm.cluster({
        baseDir: 'custom_egg',
        customEgg: path.join(__dirname, 'fixtures/bar'),
        workers: 1,
        cache: false,
        coverage: false,
        opt: {
          execArgv: [ '--trace-sync-io' ],
        },
      });
      app.debug();
      app.expect('stdout', /app_worker#1:/)
        .expect('stderr', /Detected use of sync API/)
        .end(done);
    });
  });

  describe('cluster with egg.framework=yadan', () => {
    let app;
    after(() => app.close());

    it('should pass execArgv', done => {
      app = mm.cluster({
        baseDir: 'yadan_app',
        workers: 1,
        cache: false,
        coverage: false,
      });
      app.expect('stdout', /app_worker#1:/)
        .end(done);
    });
  });

  describe('prerequire', () => {
    let app;
    after(() => app.close());

    it('should load files', done => {
      mm(process.env, 'EGG_BIN_PREREQUIRE', 'true');
      mm(process.env, 'DEBUG', 'egg-mock:prerequire');
      app = mm.cluster({
        baseDir: 'yadan_app',
        workers: 1,
        cache: false,
        coverage: false,
      });
      app
        .expect('stderr', /prerequire app\/extend\/application.js/)
        .expect('code', 0)
        .end(done);
    });
  });
});
