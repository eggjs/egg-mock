const debug = require('util').debuglog('egg-mock:inject_context');
const appHandler = require('./app_handler');
const EGG_CONTEXT = Symbol.for('mocha#suite#ctx#eggCtx');

/**
 * Monkey patch the mocha instance with egg context.
 *
 * @param {Function} mocha -
 */
function injectContext(mocha) {
  if (!mocha || mocha._injectContextLoaded) {
    return;
  }

  const Runner = mocha.Runner;
  const runSuite = Runner.prototype.runSuite;
  const runTests = Runner.prototype.runTests;

  // Inject ctx for before/after.
  Runner.prototype.runSuite = async function(suite, fn) {
    debug('run suite: %s %b', suite.title, !!(suite.ctx && suite[EGG_CONTEXT]));
    const app = await appHandler.getApp(suite);
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

  // Inject ctx for beforeEach/it/afterEach.
  // And ctx with before/after is not same as beforeEach/it/afterEach.
  Runner.prototype.runTests = async function(suite, fn) {
    const app = await appHandler.getApp(suite);
    const self = this;
    if (!app) {
      return runTests.call(self, suite, fn);
    }

    const tests = suite.tests.slice();

    function done(errSuite) {
      suite.tests = tests;
      return fn(errSuite);
    }

    async function next(i) {
      const test = tests[i];
      if (!test) {
        return done();
      }
      suite.tests = [ test ];

      const app = await appHandler.getApp(suite);
      await app.ready();
      const mockContextFun = app.mockModuleContextScope || app.mockContextScope;
      try {
        await mockContextFun.call(app, async function() {
          await new Promise((resolve, reject) => {
            runTests.call(self, suite, errSuite => {
              if (errSuite) {
                return reject(errSuite);
              }
              return resolve();
            });
          });
        });
      } catch (err) {
        err.message = '[egg-mock] run mock context error: ' + err.message;
        console.error(err);
        return done(suite);
      }
      return next(i + 1);
    }
    next(0).catch(e => {
      e.message = '[egg-mock] inject context error: ' + e.message;
      console.error(e);
      done(suite);
    });
  };

  mocha._injectContextLoaded = true;
}

module.exports = injectContext;
