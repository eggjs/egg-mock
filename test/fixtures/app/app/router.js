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
};
