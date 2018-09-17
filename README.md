# egg-mock

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-mock.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-mock
[travis-image]: https://img.shields.io/travis/eggjs/egg-mock.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-mock
[codecov-image]: https://codecov.io/github/eggjs/egg-mock/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/eggjs/egg-mock?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-mock.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-mock
[snyk-image]: https://snyk.io/test/npm/egg-mock/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-mock
[download-image]: https://img.shields.io/npm/dm/egg-mock.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-mock

Mock library for testing Egg applications, plugins and custom Egg frameworks with ease. `egg-mock` inherits all APIs from [node_modules/mm](https://github.com/node-modules/mm), offering more flexibility.

## Install

```bash
$ npm i egg-mock --save-dev
```

## Usage

### Create testcase

Launch a mock server with `mm.app`

```js
// test/index.test.js
const path = require('path');
const mm = require('egg-mock');

describe('some test', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/foo'
    });
    return app.ready();
  })
  after(() => app.close());

  it('should request /', () => {
    return app.httpRequest()
      .get('/')
      .expect(200);
  });
});
```

Retrieve Agent instance through `app.agent` after `mm.app` started.

Using `mm.cluster` launch cluster server, you can use the same API as `mm.app`;

### Test Application

`baseDir` is optional that is `process.cwd()` by default.

```js
before(() => {
  app = mm.app();
  return app.ready();
});
```

### Test Framework

framework is optional, it's `node_modules/egg` by default.

```js
before(() => {
  app = mm.app({
    baseDir: 'apps/demo',
    framework: true,
  });
  return app.ready();
});
```

### Test Plugin

If `eggPlugin.name` is defined in `package.json`, it's a plugin that will be loaded to plugin list automatically.

```js
before(() => {
  app = mm.app({
    baseDir: 'apps/demo',
  });
  return app.ready();
});
```

You can also test the plugin in different framework, e.g. test [aliyun-egg](https://github.com/eggjs/aliyun-egg) and framework-b in one plugin.

```js
describe('aliyun-egg', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/demo',
      framework: path.join(__dirname, 'node_modules/aliyun-egg'),
    });
    return app.ready();
  });
});

describe('framework-b', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/demo',
      framework: path.join(__dirname, 'node_modules/framework-b'),
    });
    return app.ready();
  });
});
```

If it's detected as an plugin, but you don't want it to be, you can use `plugin = false`.

```js
before(() => {
  app = mm.app({
    baseDir: 'apps/demo',
    plugin: false,
  });
  return app.ready();
});
```

## API

### mm.app(options)

Create a mock application.

### mm.cluster(options)

Create a mock cluster server, but you can't use API in application, you should test using `supertest`.

```js
const mm = require('egg-mock');
describe('test/app.js', () => {
  let app, config;
  before(() => {
    app = mm.cluster();
    return app.ready();
  });
  after(() => app.close());

  it('some test', () => {
    return app.httpRequest()
      .get('/config')
      .expect(200)
  });
});
```

You can disable coverage, because it's slow.

```js
mm.cluster({
  coverage: false,
});
```

### mm.env(env)

Mock env when starting

```js
// production environment
mm.env('prod');
mm.app({
  cache: false,
});
```

Environment list <https://github.com/eggjs/egg-core/blob/master/lib/loader/egg_loader.js#L82>

### mm.consoleLevel(level)

Mock level that print to stdout/stderr

```js
// DON'T log to terminal
mm.consoleLevel('NONE');
```

level list: `DEBUG`, `INFO`, `WARN`, `ERROR`, `NONE`

### mm.home(homePath)

mock home directory

### mm.restore()

restore all mock data, e.g. `afterEach(mm.restore)`

### options

Options for `mm.app` and `mm.cluster`

#### baseDir {String}

The directory of application, default is `process.cwd()`.

```js
mm.app({
  baseDir: path.join(__dirname, 'fixtures/apps/demo'),
})
```

You can use a string based on `$CWD/test/fixtures` for short

```js
mm.app({
  baseDir: 'apps/demo',
})
```

#### framework {String/Boolean}

The directory of framework

```js
mm.app({
  baseDir: 'apps/demo',
  framework: path.join(__dirname, 'fixtures/egg'),
})
```

It can be true when test an framework

#### plugin

The directory of plugin, it's detected automatically.

```js
mm.app({
  baseDir: 'apps/demo',
})
```

#### plugins {Object}

Define a list of plugins

#### cache {Boolean}

Determine whether enable cache. it's cached by baseDir.

#### clean {Boolean}

Clean all logs directory, default is true.

If you are using `ava`, disable it.

### app.mockLog([logger]) and app.expectLog(str[, logger])

Assert some string value in the logger instance.
It is recommended to pair `app.mockLog()` with `app.expectLog()`.
Using `app.expectLog()` alone requires dependency on the write speed of the log. When the server disk is high IO, unstable results will occur.

```js
it('should work', async () => {
  app.mockLog();
  await app.httpRequest()
    .get('/')
    .expect('hello world')
    .expect(200);

  app.expectLog('foo in logger');
  app.expectLog('foo in coreLogger', 'coreLogger');
  app.expectLog('foo in myCustomLogger', 'myCustomLogger');
});
```

### app.httpRequest()

Request current app http server.

```js
it('should work', () => {
  return app.httpRequest()
    .get('/')
    .expect('hello world')
    .expect(200);
});
```

See [supertest](https://github.com/visionmedia/supertest) to get more APIs.

#### .unexpectHeader(name)

Assert current response not contains the specified header

```js
it('should work', () => {
  return app.httpRequest()
    .get('/')
    .unexpectHeader('set-cookie')
    .expect(200);
});
```

#### .expectHeader(name)

Assert current response contains the specified header

```js
it('should work', () => {
  return app.httpRequest()
    .get('/')
    .expectHeader('set-cookie')
    .expect(200);
});
```

### app.mockContext(options)

```js
const ctx = app.mockContext({
  user: {
    name: 'Jason'
  }
});
console.log(ctx.user.name); // Jason
```

### app.mockCookies(data)

```js
app.mockCookies({
  foo: 'bar'
});
const ctx = app.mockContext();
console.log(ctx.getCookie('foo'));
```

### app.mockHeaders(data)

Mock request header

### app.mockSession(data)

```js
app.mockSession({
  foo: 'bar'
});
const ctx = app.mockContext();
console.log(ctx.session.foo);
```

### app.mockService(service, methodName, fn)

```js
it('should mock user name', function* () {
  app.mockService('user', 'getName', function* (ctx, methodName, args) {
    return 'popomore';
  });
  const ctx = app.mockContext();
  yield ctx.service.user.getName();
});
```

### app.mockServiceError(service, methodName, error)

You can mock an error for service

```js
app.mockServiceError('user', 'home', new Error('mock error'));
```

### app.mockCsrf()

```js
app.mockCsrf();

return app.httpRequest()
  .post('/login')
  .expect(302);
```

### app.mockHttpclient(url, method, data)

Mock httpclient request, e.g.: `ctx.curl`

```js
app.get('/', function*() {
  const ret = yield this.curl('https://eggjs.org');
  this.body = ret.data.toString();
});

app.mockHttpclient('https://eggjs.org', {
  // can be buffer / string / json，
  // will auto convert to buffer
  // follow options.dataType to convert
  data: 'mock egg',
});
// app.mockHttpclient('https://eggjs.org', 'get', mockResponse); // mock get
// app.mockHttpclient('https://eggjs.org', [ 'get' , 'head' ], mockResponse); // mock get and head
// app.mockHttpclient('https://eggjs.org', '*', mockResponse); // mock all methods
// app.mockHttpclient('https://eggjs.org', mockResponse); // mock all methods by default

return app.httpRequest()
  .post('/')
  .expect('mock egg');
```

You can also use Regular Expression for matching url.

```js
app.mockHttpclient(/\/users\/[a-z]$/i, {
  data: {
    name: 'egg',
  },
});
```

You can alse mock agent.httpclient

```js
app.agent.mockHttpclient('https://eggjs.org', {
  data: {
    name: 'egg',
  },
});
```

## Bootstrap

We also provide a bootstrap file for applications' unit test to reduce duplicated code:

```js
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test app', () => {
  it('should request success', () => {
    // mock data will be restored each case
    mock.data(app, 'method', { foo: 'bar' });
    return app.httpRequest()
      .get('/foo')
      .expect(res => {
        assert(!res.headers.foo);
      })
      .expect(/bar/);
  });
});
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
