'use strict';

const path = require('path');
const assert = require('power-assert');
const request = require('supertest');
const mm = require('..');

const fixtures = path.join(__dirname, 'fixtures');

describe('test/cluster.test.js', function() {

  afterEach(mm.restore);

  it('should have members', function(done) {
    const app = mm.cluster({
      baseDir: path.join(fixtures, 'demo'),
      customEgg: path.join(__dirname, '../node_modules/egg'),
      cache: false,
      coverage: false,
    });
    app.callback().should.equal(app);
    app.listen().should.equal(app);
    app.ready(function() {
      assert(app.process);
      app.close();
      done();
    });
  });

  describe('cluster with fullpath baseDir', function() {
    before(function(done) {
      this.app = mm.cluster({
        baseDir: path.join(fixtures, 'demo'),
        customEgg: path.join(__dirname, '../node_modules/egg'),
        cache: false,
        coverage: false,
      });
      this.app.ready(done);
    });
    after(function() {
      this.app.close();
    });

    it('should work', function(done) {
      request(this.app.callback())
        .get('/hello')
        .expect('hi')
        .expect(200, done);
    });
  });

  describe('cluster with shortpath baseDir', function() {
    before(function(done) {
      this.app = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
        cache: false,
        coverage: false,
      });
      this.app.ready(done);
    });
    after(function() {
      this.app.close();
    });

    it('should work', function(done) {
      request(this.app.callback())
        .get('/hello')
        .expect('hi')
        .expect(200, done);
    });
  });

  describe('cluster with customEgg=string', function() {
    before(function(done) {
      this.app = mm.cluster({
        baseDir: 'apps/barapp',
        customEgg: path.join(fixtures, 'bar'),
        cache: false,
        coverage: false,
      });
      this.app.ready(done);
    });
    after(function() {
      this.app.close();
    });

    it('should work', function(done) {
      request(this.app.callback())
      .get('/')
      .expect({
        foo: 'bar',
        foobar: 'bar',
      })
      .expect(200, done);
    });
  });

  describe('cluster with customEgg=true', function() {
    before(function(done) {
      mm(process, 'cwd', function() {
        return path.join(fixtures, 'bar');
      });
      this.app = mm.cluster({
        baseDir: path.join(fixtures, 'apps/barapp'),
        customEgg: true,
        cache: false,
        coverage: false,
      });
      this.app.ready(done);
    });
    after(function() {
      this.app.close();
    });

    it('should work', function(done) {
      request(this.app.callback())
      .get('/')
      .expect({
        foo: 'bar',
        foobar: 'bar',
      })
      .expect(200, done);
    });
  });

  describe('cluster with cache', function() {
    it('should return cached cluster app', function() {
      const app1 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });
      const app2 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });

      app1.should.equal(app2);
    });

    it('should return new app if cached app has been closed', function() {
      const app1 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });

      app1.close();
      const app2 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });
      app2.should.not.equal(app1);
    });

    it('should return new app if cached app has been closeped', function() {
      const app1 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });

      app1.close();
      const app2 = mm.cluster({
        baseDir: 'demo',
        customEgg: path.join(__dirname, '../node_modules/egg'),
      });
      app2.should.not.equal(app1);
    });
  });

  describe('cluster with eggPath', function() {
    let app;
    after(function() {
      app.close();
    });
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
    after(function() {
      app.close();
    });
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
    after(function() {
      app.close();
    });
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
