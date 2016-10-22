'use strict';

const path = require('path');
const mm = require('mm');
const assert = require('power-assert');
const formatOptions = require('../lib/format_options');
const customEgg = path.join(__dirname, '../node_modules/egg');

describe('test/format_options.test.js', function() {

  afterEach(mm.restore);

  it('should return the default options', function() {
    const options = formatOptions({ customEgg });
    assert(options);
    assert(options.coverage === true);
    assert(options.cache === true);
    assert(options.baseDir === process.cwd());
    assert.deepEqual(options.plugins['egg-mock'], {
      enable: true,
      path: path.join(__dirname, '..'),
    });
  });

  it('should return baseDir when on windows', function() {
    const baseDir = 'D:\\projectWorkSpace\\summer';
    mm(path, 'isAbsolute', path.win32.isAbsolute);
    mm(process, 'cwd', function() {
      return baseDir;
    });
    const options = formatOptions({ customEgg });
    assert(options.baseDir === baseDir);
  });

  it('should set cache', function() {
    const options = formatOptions({ cache: false, customEgg });
    assert(options);
    assert(options.cache === false);
  });

  it('should set coverage', function() {
    const options = formatOptions({ coverage: false, customEgg });
    assert(options);
    assert(options.coverage === false);
  });

  it('should return options when set full baseDir', function() {
    const baseDir = path.join(__dirname, 'fixtures');
    const options = formatOptions({ baseDir, customEgg });
    assert(options);
    assert(options.baseDir === baseDir);
  });

  it('should return options when set short baseDir', function() {
    const options = formatOptions({ baseDir: 'apps/foo', customEgg });
    assert(options);
    assert(options.baseDir === path.join(__dirname, 'fixtures/apps/foo'));
  });

  it('should return options when set customEgg', function() {
    const customEgg = path.join(__dirname, 'fixtures/bar');
    const options = formatOptions({ customEgg });
    assert(options);
    assert(options.customEgg === customEgg);
  });

  it('should return options when set customEgg=true', function() {
    const baseDir = path.join(__dirname, 'fixtures/bar');
    mm(process, 'cwd', function() {
      return baseDir;
    });
    const options = formatOptions({ customEgg: true });
    assert(options);
    assert(options.customEgg === baseDir);
  });

  it('should push plugins when in plugin dir', function() {
    const baseDir = path.join(__dirname, 'fixtures/plugin');
    mm(process, 'cwd', function() {
      return baseDir;
    });
    const options = formatOptions({ customEgg });
    assert(options);
    assert.deepEqual(options.plugins.plugin1, {
      enable: true,
      path: baseDir,
    });
  });

  it('should not push pluings when in plugin dir but options.plugin = false', function() {
    const baseDir = path.join(__dirname, 'fixtures/plugin');
    mm(process, 'cwd', function() {
      return baseDir;
    });
    const options = formatOptions({
      plugin: false,
      customEgg,
    });
    assert(options);
    assert(!options.plugins.plugin1);
  });

  it('should not throw when no eggPlugin', function() {
    const baseDir = path.join(__dirname, 'fixtures/plugin_throw');
    mm(process, 'cwd', function() {
      return baseDir;
    });
    formatOptions({ customEgg });
  });

  it('should throw when no eggPlugin and options.plugin === true', function() {
    const baseDir = path.join(__dirname, 'fixtures/plugin_throw');
    mm(process, 'cwd', function() {
      return baseDir;
    });
    assert.throws(() => {
      formatOptions({
        plugin: true,
        customEgg,
      });
    }, `should set eggPlugin in ${baseDir}/package.json`);
  });

  it('should mock process.env.HOME when EGG_SERVER_ENV is default, test, prod', function() {
    const baseDir = process.cwd();

    mm(process.env, 'EGG_SERVER_ENV', 'local');
    assert.notEqual(process.env.HOME, baseDir);

    mm(process.env, 'EGG_SERVER_ENV', 'default');
    formatOptions({ customEgg });
    assert.equal(process.env.HOME, baseDir);

    mm(process.env, 'EGG_SERVER_ENV', 'test');
    formatOptions({ customEgg });
    assert.equal(process.env.HOME, baseDir);

    mm(process.env, 'EGG_SERVER_ENV', 'prod');
    formatOptions({ customEgg });
    assert.equal(process.env.HOME, baseDir);
  });

  it('should not mock process.env.HOME when it has mocked', function() {
    const baseDir = process.cwd();

    mm(process.env, 'HOME', '/mockpath');
    mm(process.env, 'EGG_SERVER_ENV', 'default');
    formatOptions({ customEgg });
    assert.notEqual(process.env.HOME, baseDir);
  });
});
