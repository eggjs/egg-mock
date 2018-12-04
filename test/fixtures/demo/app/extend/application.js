'use strict';

module.exports = {
  mockDevice(obj) {
    obj.mock = true;
    return obj;
  },

  * mockGenerator(obj) {
    obj.mock = true;
    return obj;
  },

  mockPromise(obj) {
    obj.mock = true;
    return Promise.resolve(obj);
  },
};
