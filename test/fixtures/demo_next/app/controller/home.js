'use strict';

exports.get = function* () {
  this.body = {
    cookieValue: this.getCookie('foo') || undefined,
    cookiesValue: this.cookies.get('foo') || undefined,
    sessionValue: this.session.foo,
  };
};

exports.post = function* () {
  this.body = 'done';
};

exports.hello = function* () {
  this.body = 'hi';
};

exports.service = function* () {
  this.body = {
    foo1: yield this.service.foo.get(),
    foo2: yield this.service.bar.foo.get(),
    foo3: this.service.foo.getSync(),
    thirdService: yield this.service.third.bar.foo.get(),
  };
};

exports.serviceOld = function* () {
  this.body = yield this.service.old.test();
};

exports.header = function* () {
  this.body = {
    header: this.get('customheader'),
  };
};

exports.urllib = function* () {
  const url = 'http://' + this.host;
  const method = this.query.method || 'request';
  const data = this.query.data ? JSON.parse(this.query.data) : undefined;
  const dataType = this.query.dataType;
  const foo = this.query.foo;
  let requestUrl = url + (this.query.mock_url || '/mock_url');
  if (foo) {
    requestUrl = `${requestUrl}?foo=${foo}`;
  }
  let r = this.app.httpclient[method](requestUrl, {
    dataType,
    data,
  });
  if (method === 'request') r = r.then(d => d);
  const r1 = yield r;
  const r2 = yield this.app.httpclient[method](requestUrl, {
    method: 'POST',
    dataType,
    data,
    headers: {
      'x-custom': 'custom',
    },
  });
  this.body = {
    get: Buffer.isBuffer(r1.data) ? r1.data.toString() : r1.data,
    post: Buffer.isBuffer(r2.data) ? r2.data.toString() : r2.data,
  };
};

exports.streaming = async ctx => {
  const url = 'http://' + ctx.host;
  const response = await ctx.httpclient.request(url + '/mock_url', {
    method: 'GET',
    streaming: true,
  });
  ctx.status = response.status;
  ctx.body = response.res;
};

exports.mockUrlGet = function* () {
  const foo = this.query.foo;
  if (foo) {
    this.body = `url get with foo: ${foo}`;
    return;
  }
  this.body = 'url get';
};

exports.mockUrlPost = function* () {
  this.body = 'url post';
};

exports.mockUrllibHeaders = function* () {
  const url = 'http://' + this.host;
  const method = this.query.method || 'request';
  const res = yield this.app.httpclient[method](url + '/mock_url');
  this.body = res.headers;
};

exports.dataType = function* () {
  const url = 'http://' + this.host;
  const res = yield this.app.httpclient.request(url + '/mock_url', {
    dataType: 'json',
  });
  this.body = res.data;
};
