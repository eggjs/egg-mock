'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('power-assert');
const sleep = require('ko-sleep');
const mm = require('..');

const customEgg = path.join(__dirname, '../node_modules/egg');
const baseDir = path.join(__dirname, 'fixtures/apps/env-app');

describe('test/mm.test.js', function() {

  afterEach(mm.restore);

  describe('mm.env()', function() {

    let app;
    beforeEach(() => {
      mm(process.env, 'EGG_HOME', baseDir);
    });
    afterEach(() => app.close());
    afterEach(() => sleep(5000));

    it('should mock unittest', function* () {
      app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      yield app.ready();
      assert(app.config.fakeplugin.foo === 'bar-unittest');
      assert(app.config.logger.dir === path.join(baseDir, 'logs/env-app'));
    });

    it('should mock test', function* () {
      mm.env('test');
      app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      yield app.ready();
      assert(app.config.fakeplugin.foo === 'bar-test');
      assert(app.config.logger.dir === path.join(baseDir, 'logs/env-app'));
    });

    it('should mock prod', function* () {
      mm.env('prod');
      app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      yield app.ready();
      assert(app.config.fakeplugin.foo === 'bar-prod');
      assert(app.config.logger.dir === path.join(baseDir, 'logs/env-app'));
    });

    it('should mock default', function* () {
      mm.env('default');
      app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      yield app.ready();
      assert(app.config.fakeplugin.foo === 'bar-default');
      assert(app.config.logger.dir === path.join(baseDir, 'logs/env-app'));
    });

    it('should mock unittest', function* () {
      mm.env('unittest');
      app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      yield app.ready();
      assert(app.config.fakeplugin.foo === 'bar-unittest');
      assert(app.config.logger.dir === path.join(baseDir, 'logs/env-app'));
    });

    it('should mock local', function* () {
      mm.env('local');
      app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      yield app.ready();
      assert(app.config.fakeplugin.foo === 'bar-default');
      assert(app.config.logger.dir === path.join(baseDir, 'logs/env-app'));
    });
  });

  describe('mm.app({clean: false})', function() {
    let app;
    after(() => app.close());

    it('keep log dir', function* () {
      app = mm.app({ baseDir: 'apps/app-not-clean', clean: false, customEgg });
      yield app.ready();
      assert(fs.existsSync(path.join(__dirname, 'fixtures/apps/app-not-clean/logs/keep')));
    });
  });

  describe('mm.consoleLevel()', function() {
    it('shoud mock EGG_LOG', function() {
      mm.consoleLevel('none');
      assert(process.env.EGG_LOG === 'NONE');
    });

    it('shoud not mock', function() {
      mm.consoleLevel('');
      assert(!process.env.EGG_LOG);
    });
  });
});
