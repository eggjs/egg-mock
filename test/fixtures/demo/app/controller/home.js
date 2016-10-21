'use strict';

exports.get = function* () {
  this.body = {
    cookieValue: this.getCookie('foo') || undefined,
    cookiesValue: this.cookies.get('foo') || undefined,
    sessionValue: this.session.foo,
  };
};

exports.post = function*() {
  this.body = 'done';
};

exports.hello = function* () {
  this.body = 'hi';
};

exports.service = function*() {
  this.body = {
    foo1: yield this.services.foo.get(),
    foo2: yield this.services.bar.foo.get(),
    foo3: this.services.foo.getSync(),
    thirdService: yield this.services.third.bar.foo.get(),
  };
};

exports.serviceOld = function*() {
  this.body = yield this.services.old.test();
};

exports.ctoken = function*() {
  this.body = {
    cookies: this.getCookie('customcookie'),
    header: this.get('customheader'),
  };
};

exports.header = function*() {
  this.body = {
    header: this.get('customheader'),
  };
};

exports.antx = function*() {
  this.body = {
    antx1: this.app.antx['custom.antx1'],
    antx2: this.app.antx['custom.antx2'],
  };
};

exports.serverconf = function*() {
  this.body = this.app.antx['zone'];
};

exports.urllib = function*() {
  const url = 'http://' + this.host;
  const method = this.query.method || 'requestThunk';
  const dataType = this.query.dataType;
  const r1 = yield this.app.urllib[method](url + '/mock_url', {
    dataType: dataType,
  });
  const r2 = yield this.app.urllib[method](url + '/mock_url', {
    method: 'POST',
    dataType: dataType,
  });
  this.body = {
    get: Buffer.isBuffer(r1.data) ? r1.data.toString() : r1.data,
    post: Buffer.isBuffer(r2.data) ? r2.data.toString() : r2.data,
  };
};

exports.mockUrlGet = function*() {
  this.body = 'url get';
};

exports.mockUrlPost = function*() {
  this.body = 'url post';
};

exports.mockUrllibHeaders = function*() {
  const url = 'http://' + this.host;
  const method = this.query.method || 'requestThunk';
  const res = yield this.app.urllib[method](url + '/mock_url');
  this.body = res.headers;
};
