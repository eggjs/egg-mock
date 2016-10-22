'use strict';

require('should');
const path = require('path');
const fs = require('fs');
const mm = require('..');

const customEgg = path.join(__dirname, '../node_modules/egg');
const baseDir = path.join(__dirname, 'fixtures/apps/env-app');

describe.only('test/mm.test.js', function() {

  afterEach(mm.restore);

  describe('mm.env()', function() {

    it('should mock unittest', function() {
      const app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      app.config.fakeplugin.foo.should.equal('bar-unittest');
      app.config.logger.dir.should.eql(path.join(baseDir, 'logs/env-app'));
    });

    it('should mock test', function() {
      mm.env('test');
      const app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      app.config.fakeplugin.foo.should.equal('bar-test');
      app.config.logger.dir.should.eql(path.join(baseDir, 'logs/env-app'));
    });

    it('should mock prod', function() {
      mm.env('prod');
      const app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      app.config.fakeplugin.foo.should.equal('bar-prod');
      app.config.logger.dir.should.eql(path.join(baseDir, 'logs/env-app'));
    });

    it('should mock default', function() {
      mm.env('default');
      const app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      app.config.fakeplugin.foo.should.equal('bar-default');
      app.config.logger.dir.should.eql(path.join(baseDir, 'logs/env-app'));
    });

    it('should mock unittest', function() {
      mm.env('unittest');
      const app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      app.config.fakeplugin.foo.should.equal('bar-unittest');
      app.config.logger.dir.should.eql(path.join(baseDir, 'logs/env-app'));
    });

    it('should mock local', function() {
      mm.env('local');
      const app = mm.app({ baseDir: 'apps/env-app', cache: false, customEgg });
      app.config.fakeplugin.foo.should.equal('bar-default');
      app.config.logger.dir.should.eql(path.join(baseDir, 'logs/env-app'));
    });
  });

  describe('mm.app({clean: false})', function() {
    it('keep log dir', function() {
      mm.app({ baseDir: 'apps/app-not-clean', clean: false, customEgg });
      fs.existsSync(path.join(__dirname, 'fixtures/apps/app-not-clean/logs/keep')).should.be.ok();
    });
  });

  describe('mm.consoleLevel()', function() {
    it('shoud mock EGG_LOG', function() {
      mm.consoleLevel('none');
      process.env.EGG_LOG.should.eql('NONE');
    });

    it('shoud not mock', function() {
      mm.consoleLevel();
      process.env.EGG_LOG.should.eql('');
    });
  });
});
