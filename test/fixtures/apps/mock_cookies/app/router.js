'use strict';

module.exports = function(app) {
  app.get('/', function* () {
    this.body = {
      cookieValue: this.cookies.get('foo') || undefined,
      cookiesValue: this.cookies.get('foo') || undefined,
    };
  });
};
