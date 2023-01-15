const debug = require('util').debuglog('egg-mock:inject_context');
const appHandler = require('./app_handler');
const EGG_CONTEXT = Symbol.for('mocha#suite#ctx#eggCtx');

/**
 * Monkey patch the mocha instance with egg context.
 *
 * @param {Function} mocha
 */
function injectContext(mocha) {
  if (!mocha || mocha._injectContextLoaded) {
    return;
  }

  const Runner = mocha.Runner;
  const runSuite = Runner.prototype.runSuite;

  Runner.prototype.runSuite = async function(suite, fn) {
    debug('run suite: %s %b', suite.title, !!(suite.ctx && suite[EGG_CONTEXT]));
    const app = appHandler.getApp();
    const self = this;
    if (!app) {
      return runSuite.call(self, suite, fn);
    }
    let errSuite;
    try {
      await app.ready();
      const mockContextFun = app.mockModuleContextScope || app.mockContextScope;
      await mockContextFun.call(app, async function(eggCtx) {
        suite.ctx[EGG_CONTEXT] = eggCtx;
        eggCtx.mochaTitle = suite.title;
        await new Promise(resolve => {
          runSuite.call(self, suite, aErrSuite => {
            errSuite = aErrSuite;
            resolve();
          });
        });
      });
    } catch (e) {
      e.message = '[egg-mock] inject context error: ' + e.message;
      console.error(e);
    }
    return fn(errSuite);
  };

  mocha._injectContextLoaded = true;
}

module.exports = injectContext;
