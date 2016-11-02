'use strict';

const mm = require('mm');
const cluster = require('./lib/cluster');
const app = require('./lib/app');

/**
 * @namespace mm
 */
module.exports = Object.assign(mm, {

  /**
   * Create a egg mocked application
   * @method mm#app
   * @param {Object} [options]
   * - {String} baseDir - The directory of the application
   * - {Object} plugins - Tustom you plugins
   * - {String} customEgg - The directory of the egg framework
   * - {Boolean} [true] cache - Cache application based on baseDir
   * - {Boolean} [true] coverage - Swtich on process coverage, but it'll be slower
   * - {Boolean} [true] clean - Remove $baseDir/logs
   * @return {App} return {@link Application}
   * @example
   * ```js
   * var app = mm.app();
   * ```
   */
  app,

  /**
   * Create a egg mocked cluster application
   * @method mm#cluster
   * @see ClusterApplication
   */
  cluster,

  /**
   * mock the serverEnv of Egg
   * @member {Function} mm#env
   * @param {String} env - contain default, test, prod, local, unittest
   * @see http://gitlab.alibaba-inc.com/egg/egg-loader/blob/master/lib/base_loader.js#L102
   */
  env(env) {
    mm(process.env, 'EGG_MOCK_SERVER_ENV', env);
    mm(process.env, 'EGG_SERVER_ENV', env);
  },

  /**
   * mock console level
   * @param {String} level - logger level
   */
  consoleLevel(level) {
    level = (level || '').toUpperCase();
    mm(process.env, 'EGG_LOG', level);
  },

  home(homePath) {
    if (homePath) {
      mm(process.env, 'EGG_HOME', homePath);
    }
  },

});

process.setMaxListeners(100);

process.once('SIGQUIT', () => {
  process.exit(0);
});

process.once('SIGTERM', () => {
  process.exit(0);
});

process.once('SIGINT', () => {
  process.exit(0);
});
