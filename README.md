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

mock server for egg

## Install

```bash
$ npm i egg-mock --save-dev
```

## Usage

### 创建测试用例

通过 `mm.app` 启动应用，可以使用 App 的 API 模拟数据

```js
const mm = require('@ali/mm');
const request = require('supertest');

describe('some test', function () {
  let app;
  before(function(done) {
    app = mm.app({
      baseDir: 'apps/foo'
    });
    app.ready(done);
  })
  after(function() {
    app.close();
  })
  afterEach(mm.restore);

  it('should request /', function (done) {
    request(app.callback())
    .get('/')
    .expect(200, done);
  });
});
```

使用 `mm.app` 启动后可以通过 `app.agent` 访问到 agent 对象。

使用 `mm.cluster` 启动多进程测试，API 与 `mm.app` 一致。

### 应用开发者

应用开发者不需要传入参数

```js
before(function(done) {
  app = mm.app();
  app.ready(done);
});
```

### 框架开发者

框架开发者需要指定 customEgg，会将当前路径指定为框架入口

```js
before(function(done) {
  app = mm.app({
    baseDir: 'apps/demo',
    customEgg: true,
  });
  app.ready(done);
});
```

### 插件开发者

在插件目录下执行测试用例时，只要 `package.json` 中有 `eggPlugin.name` 字段，就会自动把当前目录加到插件列表中。

```js
before(function(done) {
  app = mm.app({
    baseDir: 'apps/demo',
  });
  app.ready(done);
});
```

插件测试会通过 [@ali/egg-web-names](http://gitlab.alibaba-inc.com/egg/egg-web-names) 找默认框架，也可以指定 customEgg，比如希望在 chair 和 midway 同时测试此插件。

```js
describe('chair', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/demo',
      customEgg: path.join(__dirname, 'node_modules/@ali/egg'),
    });
    this.app.ready(done);
  });
})

describe('midway', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/demo',
      customEgg: path.join(__dirname, 'node_modules/midway'),
    });
    this.app.ready(done);
  });
})
```

如果当前目录确实是一个 egg 插件，但是又不想当它是一个插件来测试，可以通过 `options.plugin` 选项来关闭：

```js
before(function(done) {
  app = mm.app({
    baseDir: 'apps/demo',
    plugin: false,
  });
  app.ready(done);
});
```

## API

### mm.app(options)

创建一个 mock 的应用。

### mm.cluster(options)

创建一个多进程应用，因为是多进程应用，无法获取 worker 的属性，只能通过 supertest 请求。

```js
describe('test/app.js', function() {
  let app, config;
  before(function(done) {
    app = mm.cluster();
    app.ready(done);
  });
  before(function(done) {
    request(app.callback())
    .get('/config')
    .end(function(err, res) {
      should.not.exists(err);
      // 获取 app.config，在 controller
      // this.body = this.app.config;
      config = res.body;
      done();
    })
  });
  after(function() {
    app.close();
  })
  afterEach(mm.restore);
});
```

默认会启用覆盖率，因为覆盖率比较慢，可以设置 coverage 关闭

```js
mm.cluster({
  coverage: false,
});
```

### mm.env(env)

设置环境变量，主要用于启动阶段，运行阶段可以使用 app.mockEnv。

```js
// 模拟生成环境
mm.env('prod');
mm.app({
  cache: false,
});
```

**建议配置 cache 一起使用，不然读取缓存不会重新加载，导致 env 不会生效。**

具体值见 http://gitlab.alibaba-inc.com/egg/egg-loader/blob/master/lib/base_loader.js#L102

### mm.consoleLevel(level)

mock 终端日志打印级别

```js
// 不输出到终端
mm.consoleLevel('NONE');
```

### mm.restore

还原所有 mock 数据，一般需要结合 `afterEach(mm.restore)` 使用

### options

mm.app 和 mm.cluster 的配置参数

#### baseDir {String}

当前应用的目录，如果是应用本身的测试可以不填默认为 $CWD。

指定完整路径

```js
mm.app({
  baseDir: path.join(__dirname, 'fixtures/apps/demo'),
})
```

也支持缩写，找 test/fixtures 目录下的

```js
mm.app({
  baseDir: 'apps/demo',
})
```

#### customEgg {String/Boolean}

指定框架路径，默认会根据 [@ali/egg-web-names](http://gitlab.alibaba-inc.com/egg/egg-web-names) 的先后顺序搜索框架路径。

对于框架的测试用例，可以指定 true，见上面示例。

也可以直接指定完整路径

```js
mm.app({
  baseDir: 'apps/demo',
  customEgg: path.join(__dirname, 'fixtures/chair'),
})
```

#### antxpath {String}

传入外部的 antx 配置

#### plugin

指定插件的路径，只用于插件测试。设置为 true 会将当前路径设置到插件列表。

```js
mm.app({
  baseDir: 'apps/demo',
  plugin: true,
})
```

#### plugins {Object}

传入插件列表，可以自定义多个插件

#### cache {Boolean}

是否需要缓存，默认开启。

是通过 baseDir 缓存的，如果不需要可以关闭，但速度会慢。

#### clean {Boolean}

是否需要清理 log 目录，默认开启。

如果是通过 ava 等并行测试框架进行测试，需要手动在执行测试前进行统一的日志清理，不能通过 mm 来处理，设置 `clean` 为 `false`。

### app.mockContext(options)

模拟上下文数据

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

模拟请求头

### app.mockSession(data)

```js
app.mockSession({
  foo: 'bar'
});
const ctx = app.mockContext();
console.log(ctx.session.foo);
```

### app.mockProxy(proxy, methodName, fn)

使用此 mock，args 是经过 proxyArgsConvertor 返回的结果, 可以保证单元测试的参数通过参数类型检查。

```js
app.mockProxy('authManager', 'retrieveDataPermission', function* (ctx, methodName, args) {
  return { foo: 'bar' };
});
```

也可以便捷地 mock proxy 返回特定数据

```js
app.mockProxy('account', 'getAccountInfo', { name: 'foo' });
```

### app.mockProxyError(proxy, methodName[, error])

便捷地 mock proxy 抛出指定异常

```js
app.mockProxyError('account', 'getAccountInfo', new Error('mock error'));
app.mockProxyError('account2', 'getAccountInfo', 'mock error string is ok');
```

### app.mockProxyByScene(proxy, methodName, scene)

按照场景来 mock proxy 的返回内容。所有的场景数据都放在 `${baseDir}/mocks_data/proxy/${proxyName}/${methodName}/${scene}.js` 的文件中。

```js
app.mockProxyByScene('account', 'getAccountInfo', 'scene_1');
```

### app.mockService(service, methodName, fn)

模拟 service，和 mockProxy 类似

### app.mockServiceError(service, methodName, error)

模拟 service 出错，和 mockProxyError 类似

### app.mockServiceByScene(service, methodName, scene)

按照场景来 mock service 的返回内容，和 `mockProxyByScene` 类似。所有的场景数据都放在 `${baseDir}/mocks_data/service/${serviceName}/${methodName}/${scene}.js` 的文件中。

```js
app.mockServiceByScene('foo', 'bar', 'scene_1');
```

### app.mockRequest(request)

mock 一个 request 对象

### app.mockCsrf();

模拟 csrf，不用传递 token

```js
app.mockCsrf();
request(app.callback())
.post('/login')
.expect(302, done);
```

### app.mockCtoken();

模拟 ctoken，不用传递 token

```js
app.mockCtoken();
request(app.callback())
.post('/data.json')
.expect({stat: 'ok'}, done);
```

### app.mockAntx()

模拟 antx

```js
app.get('/', function*() {
  this.body = this.app.antx.a;
})

app.mockAntx({ a: 1 });
request(app.callback())
.post('/')
.expect('1', done);
```

### app.mockUrllib(url, method, data)

模拟 urllib

```js
app.get('/', function*() {
  const ret = yield this.curl('http://www.alipay.com');
  this.body = ret.data.toString();
});

app.mockUrllib('http://www.alipay.com', {
  // 模拟的参数，可以是 buffer / string / json，
  // 都会转换成 buffer
  // 按照请求时的 options.dataType 来做对应的转换
  data: 'mock alipay',
});
request(app.callback())
.post('/')
.expect('mock alipay', done);
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
