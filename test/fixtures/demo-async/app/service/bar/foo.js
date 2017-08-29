'use strict';

module.exports = function(app) {
  class Foo extends app.Service {
    constructor(ctx) {
      super(ctx);
    }
    async get() {
      return 'bar';
    }
  }

  return Foo;
};
