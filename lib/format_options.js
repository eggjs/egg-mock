'use strict';

const path = require('path');
const mm = require('mm');
const debug = require('debug')('mm');
const getFrameworkOrEggPath = require('egg-utils').getFrameworkOrEggPath;

/**
 * format the options
 * @param  {Objct} options - options
 * @return {Object} options
 */
module.exports = function formatOptions(options) {
  const defaults = {
    baseDir: process.cwd(),
    cache: true,
    coverage: true,
  };
  options = Object.assign({}, defaults, options);

  // relative path to test/fixtures
  // ```js
  // formatOptions({ baseDir: 'app' }); // baseDir => $PWD/test/fixtures/app
  // ```
  if (!path.isAbsolute(options.baseDir)) {
    options.baseDir = path.join(process.cwd(), 'test/fixtures', options.baseDir);
  }

  // test for framework
  if (options.customEgg === true) {
    options.customEgg = process.cwd();
    // diable plugin test when it's framwork
    options.plugin = false;
  } else if (!options.customEgg) {
    options.customEgg = getFrameworkOrEggPath(process.cwd());
  }

  const plugins = options.plugins = options.plugins || {};

  // add self as a plugin
  plugins['egg-mock'] = {
    enable: true,
    path: path.join(__dirname, '..'),
  };

  // test for plugin
  if (options.plugin !== false) {
    // add self to plugin list
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pluginName = getPluginName(pkgPath);
    if (options.plugin && !pluginName) {
      throw new Error(`should set eggPlugin in ${pkgPath}`);
    }
    if (pluginName) {
      plugins[pluginName] = {
        enable: true,
        path: process.cwd(),
      };
    }
  }

  // mock HOME as baseDir, but ignore if it has been mocked
  const env = process.env.EGG_SERVER_ENV;
  if (!mm.isMocked(process.env, 'HOME') &&
    (env === 'default' || env === 'test' || env === 'prod')) {
    mm(process.env, 'HOME', options.baseDir);
  }

  debug('format options: %j', options);
  return options;
};

function getPluginName(pkgPath) {
  try {
    const pkg = require(pkgPath);
    if (pkg.eggPlugin && pkg.eggPlugin.name) {
      return pkg.eggPlugin.name;
    }
  } catch (_) {
    // ignore
  }
}
