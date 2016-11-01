'use strict';

module.exports = function(app) {
  app.get('/', function*() {
    this.body = {
      cookieValue: this.getCookie('foo') || undefined,
      cookiesValue: this.cookies.get('foo') || undefined,
    };
  });
};
