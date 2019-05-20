'use strict';

module.exports = app => {
  app.get('home', '/', function* () {
    this.cookies.set('cookie', 'hey');
    this.body = 'home';
  });

  app.get('session', '/return', function* () {
    const cookie = this.cookies.get('cookie');
    if (cookie) {
      this.body = cookie;
    } else {
      this.body = ':(';
    }
  });
};
