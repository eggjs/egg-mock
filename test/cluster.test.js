'use strict';

const path = require('path');
const assert = require('power-assert');
const request = require('supertest');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/cluster.test.js', function() {

  afterEach(mm.restore);

  describe('normal', () => {
    let app;
    before(() => {
      app = mm.cluster({
        baseDir: path.join(fixtures, 'demo'),
        customEgg: path.join(__dirname, '../node_modules/egg'),
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
  });

  describe('cluster with fullpath baseDir', function() {
    let app;
    before(function(done) {
      app = mm.cluster({
        baseDir: path.join(fixtures, 'demo'),
        customEgg: path.join(__dirname, '../node_modules/egg'),
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', function(done) {
      request(app.callback())
        .get('/hello')
        .expect('hi')
        .expect(200, done);
    });
  });

  describe('cluster with shortpath baseDir', function() {
    let app;
    before(function(done) {
      app = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', function(done) {
      request(app.callback())
        .get('/hello')
        .expect('hi')
        .expect(200, done);
    });
  });

  describe('cluster with customEgg=string', function() {
    let app;
    before(function(done) {
      app = mm.cluster({
        baseDir: 'apps/barapp',
        customEgg: path.join(fixtures, 'bar'),
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', function(done) {
      request(app.callback())
      .get('/')
      .expect({
        foo: 'bar',
        foobar: 'bar',
      })
      .expect(200, done);
    });
  });

  describe('cluster with customEgg=true', function() {
    let app;
    before(function(done) {
      mm(process, 'cwd', function() {
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

    it('should work', function(done) {
      request(app.callback())
      .get('/')
      .expect({
        foo: 'bar',
        foobar: 'bar',
      })
      .expect(200, done);
    });
  });

  describe('cluster with cache', function() {
    let app1;
    let app2;
    afterEach(() => {
      const promises = [];
      app1 && promises.push(app1.close());
      app2 && promises.push(app2.close());
      return Promise.all(promises);
    });

    it('should return cached cluster app', function* () {
      const app1 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });
      yield app1.ready();

      const app2 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });
      yield app2.ready();

      assert(app1 === app2);
    });

    it('should return new app if cached app has been closed', function* () {
      const app1 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });
      yield app1.ready();
      yield app1.close();

      const app2 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });
      yield app2.ready();

      assert(app2 !== app1);
    });

  });

  describe('cluster with eggPath', function() {
    let app;
    after(() => app.close());

    it('should get eggPath', function(done) {
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

  describe('cluster with workers', function() {
    let app;
    after(() => app.close());

    it('should get 2 workers', function(done) {
      app = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, 'fixtures/chair'),
        workers: 2,
        cache: false,
        coverage: false,
      });
      app.expect('stdout', /App Worker#1:/)
      .expect('stdout', /App Worker#2:/)
      .end(done);
    });
  });

  describe('cluster with opts', function() {
    let app;
    after(() => app.close());

    it('should pass execArgv', function(done) {
      app = mm.cluster({
        baseDir: 'custom_egg',
        customEgg: path.join(__dirname, 'fixtures/bar'),
        workers: 1,
        cache: false,
        coverage: false,
        opt: {
          execArgv: [ '--debug' ],
        },
      });
      app.expect('stdout', /App Worker#1:/)
      .expect('stderr', /Debugger listening on/)
      .end(done);
    });
  });
});
