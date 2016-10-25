'use strict';

const request = require('supertest');
const path = require('path');
const assert = require('power-assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/app.test.js', function() {
  afterEach(mm.restore);

  // 测试 mm.app
  call('app');
  // 测试 mm.cluster
  call('cluster');
});

function call(method) {
  let app;
  describe(`mm.${method}()`, function() {
    before(function(done) {
      const baseDir = path.join(fixtures, 'app');
      mm(process, 'cwd', function() {
        return baseDir;
      });
      app = mm[method]({
        customEgg: path.join(__dirname, '../node_modules/egg'),
        cache: false,
        coverage: false,
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should work', function(done) {
      request(app.callback())
      .get('/')
      .expect('foo')
      .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, plugin=string })`, function() {
    const pluginDir = path.join(fixtures, 'fooPlugin');
    before(function(done) {
      mm(process, 'cwd', function() {
        return pluginDir;
      });
      app = mm[method]({
        baseDir: path.join(__dirname, 'fixtures/apps/foo'),
        customEgg: path.join(__dirname, '../node_modules/egg'),
        plugin: 'fooPlugin',
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
        fooPlugin: true,
      })
      .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, plugin=true })`, function() {
    const pluginDir = path.join(fixtures, 'fooPlugin');
    before(function(done) {
      mm(process, 'cwd', function() {
        return pluginDir;
      });
      app = mm[method]({
        baseDir: path.join(__dirname, 'fixtures/apps/foo'),
        customEgg: path.join(__dirname, '../node_modules/egg'),
        plugin: true,
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
        fooPlugin: true,
      })
      .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, plugins })`, function() {
    before(function(done) {
      app = mm[method]({
        baseDir: path.join(__dirname, 'fixtures/apps/foo'),
        plugins: {
          fooPlugin: {
            enable: true,
            path: path.join(fixtures, 'fooPlugin'),
          },
        },
        customEgg: path.join(__dirname, '../node_modules/egg'),
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
        fooPlugin: true,
      })
      .expect(200, done);
    });
  });

  describe(`mm.${method}({ baseDir, customEgg=fullpath})`, function() {
    before(function(done) {
      app = mm[method]({
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


  describe(`mm.${method}({ baseDir, customEgg=true})`, function() {
    before(function(done) {
      mm(process, 'cwd', function() {
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

  describe(`mm.${method}({ baseDir, cache=true })`, function() {
    let app1;
    let app2;
    before(function(done) {
      app1 = mm[method]({
        customEgg: path.join(__dirname, '../node_modules/egg'),
        baseDir: 'cache',
        coverage: false,
      });
      app1.ready(done);
    });
    before(function(done) {
      app2 = mm[method]({
        customEgg: path.join(__dirname, '../node_modules/egg'),
        baseDir: 'cache',
        coverage: false,
      });
      app2.ready(done);
    });
    after(() => Promise.all([
      app1.close(),
      app2.close(),
    ]));

    it('should equal', function() {
      assert(app1 === app2);
    });
  });
}
