'use strict';

module.exports = function(app) {
  class Foo extends app.Service {
    constructor(ctx) {
      super(ctx);
    }
    * get() {
      return 'bar';
    }

    getSync() {
      return 'bar';
    }
  }

  return Foo;
};
