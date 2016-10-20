'use strict';

module.exports = function(app) {
  app.get('/', function*() {
    this.body = {
      fooPlugin: this.app.fooPlugin,
    };
  });
};
