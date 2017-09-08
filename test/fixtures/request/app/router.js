'use strict';

module.exports = app => {
  app.get('home', '/', function* () {
    this.body = 'hello world';
  });

  app.get('session', '/session', function* () {
    this.body = 'hello session';
  });
};
