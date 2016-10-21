'use strict';

const path = require('path');
const mm = require('..');

const customEgg = path.join(__dirname, '../node_modules/egg');
const fixtures = path.join(__dirname, 'fixtures');

describe.only('test/ctx.test.js', function() {

  afterEach(mm.restore);

  let app;
  before(done => {
    app = mm.app({
      baseDir: path.join(fixtures, 'demo'),
      customEgg,
    });
    app.ready(done);
  });

  it('should has logger, app, request', () => {
    const ctx = app.mockContext();
    ctx.app.should.be.a.Object;
    ctx.request.url.should.equal('/');
    ctx.request.ip.should.equal('127.0.0.1');
    ctx.logger.should.be.a.Object;
    ctx.coreLogger.should.be.a.Object;
  });

  it('should ctx.ip work', () => {
    const ctx = app.mockContext();
    ctx.request.headers['x-forwarded-for'] = '';
    ctx.request.ip.should.equal('127.0.0.1');
  });

  it('should has services', function* () {
    const ctx = app.mockContext();
    const data = yield ctx.service.foo.get('foo');
    data.should.equal('bar');
  });

  describe('curl()', () => {
    it('should call curl work', function* () {
      const ctx = app.mockContext();
      const result = yield ctx.curl('https://my.alipay.com');
      result.status.should.equal(302);
      result.headers.location.should.equal('/portal/i.htm');
    });
  });

});
