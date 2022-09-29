'use strict';

module.exports = function* () {
  this.session.save();
  this.body = this.session;
};
