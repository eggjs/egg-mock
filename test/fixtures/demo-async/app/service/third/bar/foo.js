'use strict';

module.exports = function(app) {
  class Main extends app.Service {
    constructor(ctx) {
      super(ctx);
    }
    async get() {
      return 'third';
    }
  }

  return Main;
};
