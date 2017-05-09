'use strict';

module.exports = function(app) {
  class Main extends app.Service {
    constructor(ctx) {
      super(ctx);
    }
    * get() {
      return 'third';
    }
  }

  return Main;
};
