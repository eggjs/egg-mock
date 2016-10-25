'use strict';

const path = require('path');
const debug = require('debug')('mm');
const Coffee = require('coffee').Coffee;
const ready = require('get-ready');
const rimraf = require('rimraf');
const sleep = require('ko-sleep');
const formatOptions = require('./format_options');

const clusters = new Map();
const serverBin = path.join(__dirname, 'start-cluster');
let masterPort = 17000;

/**
 * A cluster version of egg.Application, you can test with supertest
 * @example
 * ```js
 * const mm = require('mm');
 * const request = require('supertest');
 *
 * describe('ClusterApplication', function() {
 *   let app;
 *   before(function (done) {
 *     app = mm.cluster({ baseDir });
 *     app.ready(done);
 *   });
 *
 *   after(function () {
 *     app.close();
 *   });
 *
 *   it('should 200', function (done) {
 *     request(app.callback())
 *     .get('/')
 *     .expect(200, done);
 *   });
 * });
 */
class ClusterApplication extends Coffee {

  /**
   * @constructor
   * @param {Object} options
   * - {String} baseDir - The directory of the application
   * - {Object} plugins - Tustom you plugins
   * - {String} customEgg - The directory of the egg framework
   * - {Boolean} [cache=true]  - Cache application based on baseDir
   * - {Boolean} [coverage=true]  - Swtich on process coverage, but it'll be slower
   * - {Boolean} [clean=true]  - Remove $baseDir/logs
   * - {Object}  [opt] - opt pass to coffee, such as { execArgv: ['--debug'] }
   * ```
   */
  constructor(options) {
    const opt = options.opt;
    delete options.opt;

    // incremental port
    options.port = ++masterPort;
    // Set 1 worker when test
    if (!options.workers) options.workers = 1;

    const args = [ JSON.stringify(options) ];
    debug('fork %s, args: %s, opt: %j', serverBin, args.join(' '), opt);
    super({
      method: 'fork',
      cmd: serverBin,
      args,
      opt,
    });

    ready.mixin(this);

    this.port = options.port;

    // print stdout and stderr when DEBUG, otherwise stderr.
    this.debug(process.env.DEBUG ? 0 : 2);

    // disable coverage
    if (options.coverage === false) {
      this.coverage(false);
    }

    process.nextTick(() => {
      this.proc.on('message', msg => {
        // 'egg-ready' and { action: 'egg-ready' }
        const action = msg && msg.action ? msg.action : msg;
        switch (action) {
          case 'egg-ready':
            this.emit('close', 0);
            break;
          case 'app-worker-died':
          case 'agent-worker-died':
            this.emit('close', 1);
            break;
          default:
            // ignore it
            break;
        }
      });
    });

    this.end(() => this.ready(true));
  }

  /**
   * the process that forked
   * @member {ChildProcess}
   */
  get process() {
    return this.proc;
  }

  /**
   * Compatible API for supertest
   * @return {ClusterApplication} return the instance
   */
  callback() {
    return this;
  }

  /**
   * Compatible API for supertest
   * @member {String} url
   * @private
   */
  get url() {
    return 'http://127.0.0.1:' + this.port;
  }

  /**
   * Compatible API for supertest
   * @return {Object}
   *  - {Number} port
   * @private
   */
  address() {
    return {
      port: this.port,
    };
  }

  /**
   * Compatible API for supertest
   * @return {ClusterApplication} return the instance
   * @private
   */
  listen() {
    return this;
  }

  /**
   * kill the process
   * @return {Promise} promise
   */
  close() {
    return new Promise(resolve => {
      if (!this.proc.connected) return resolve();
      this.proc.kill('SIGTERM');
      this.proc.on('exit', () => {
        this.closed = true;
        resolve();
      });
    }).then(() => sleep(1000));
  }

}

module.exports = function(options) {
  options = formatOptions(options);
  if (options.cache && clusters.has(options.baseDir)) {
    const app = clusters.get(options.baseDir);
    // return cache when it hasn't been killed
    if (!app.closed) {
      return app;
    }

    // delete the cache when it's closed
    clusters.delete(options.baseDir);
  }

  if (options.clean !== false) {
    rimraf.sync(path.join(options.baseDir, 'logs'));
  }

  const app = new ClusterApplication(options);
  clusters.set(options.baseDir, app);
  return app;
};

// ensure to close App process on test exit.
process.on('exit', function() {
  for (const app of clusters.values()) {
    app.close();
  }
});
