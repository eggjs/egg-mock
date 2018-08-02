'use strict';

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
};
