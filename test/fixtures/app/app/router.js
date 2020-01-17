'use strict';

const sleep = require('mz-modules/sleep');

module.exports = app => {
  app.get('/', function* () {
    this.body = 'foo';
  });

  app.get('/keepAliveTimeout', function* () {
    this.body = {
      keepAliveTimeout: this.app.serverKeepAliveTimeout,
    };
  });

  app.get('/logger', function* () {
    this.logger.info('[app.expectLog() test] ok');
    this.coreLogger.info('[app.expectLog(coreLogger) test] ok');
    this.body = { ok: true };
  });


  let counter = 0;
  app.get('/counter', function* () {
    this.body = { counter };
  });

  app.get('/counter/plus', function* () {
    this.runInBackground(function* (ctx) {
      // mock io delay
      yield sleep(10);
      if (ctx.superMan) {
        counter += 10;
        return;
      }
      counter++;
    });
    this.body = { counter };
  });

  app.get('/counter/minus', function* () {
    this.runInBackground(function* () {
      yield sleep(10);
      counter--;
    });
    this.body = { counter };
  });

  app.get('/counter/plusplus', function* () {
    this.runInBackground(function* (ctx) {
      // mock io delay
      yield sleep(10);
      if (ctx.superMan) {
        counter += 10;
      } else {
        counter++;
      }
      ctx.runInBackground(function* (ctx) {
        // mock io delay
        yield sleep(10);
        if (ctx.superMan) {
          counter += 10;
        } else {
          counter++;
        }
      });
    });
    this.body = { counter };
  });
};
