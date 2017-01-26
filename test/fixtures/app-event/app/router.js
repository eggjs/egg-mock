'use strict';

module.exports = function(app) {
  app.get('/event', function* () {
    this.app.emit('eventByRequest');
    this.body = 'done';
  });
};
