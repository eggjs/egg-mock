'use strict';

module.exports = function(app) {
  class Main extends app.Service {
    * get() {
      return 'third';
    }
  }

  return Main;
};
