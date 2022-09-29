'use strict';

module.exports = () => {
  exports.test = function* () {
    return 'hello';
  };

  return exports;
};
