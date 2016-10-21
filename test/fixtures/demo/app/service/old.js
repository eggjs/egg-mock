'use strict';

module.exports = function() {
  exports.test = function*() {
    return 'hello';
  };

  return exports;
};
