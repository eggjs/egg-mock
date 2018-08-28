'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');
const baseDir = path.join(fixtures, 'app-proxy');

describe('test/app_proxy.test.js', () => {
  afterEach(mm.restore);

  describe('when before ready', () => {
    let app;
    const baseDir = path.join(fixtures, 'app-proxy-ready');
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
    });
    after(function* () {
      yield app.ready();
      yield app.close();
    });

    it('should not get property', function* () {
      assert.throws(() => {
        app.config;
      }, /can't get config before ready/);
    });

    it('should not set property', function* () {
      assert.throws(() => {
        app.curl = function* mockCurl() {
          return 'mock';
        };
      }, /can't set curl before ready/);
    });

    it('should not define property', function* () {
      assert.throws(() => {
        Object.defineProperty(app, 'config', {
          value: {},
        });
      }, /can't defineProperty config before ready/);
    });

    it('should not delete property', function* () {
      assert.throws(() => {
        delete app.config;
      }, /can't delete config before ready/);
    });

    it('should not getOwnPropertyDescriptor property', function* () {
      assert.throws(() => {
        Object.getOwnPropertyDescriptor(app, 'config');
      }, /can't getOwnPropertyDescriptor config before ready/);
    });

    it('should not getPrototypeOf property', function* () {
      assert.throws(() => {
        Object.getPrototypeOf(app);
      }, /can't getPrototypeOf before ready/);
    });
  });

  describe('handler.get', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should get property', () => {
      assert(app.getter === 'getter');
      assert(app.method() === 'method');
    });

    it('should ignore when get property on MockApplication', function* () {
      assert(app.closed === false);
      yield app.close();
      assert(app.closed === true);
    });
  });

  describe('handler.set', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should override property with setter', function* () {
      app.curl = function* mockCurl() {
        return 'mock';
      };
      const data = yield app.curl();
      assert(data === 'mock');
    });

    it('should ignore when set property on MockApplication', function* () {
      app.closed = true;
      assert(app.closed === false);
      yield app.close();
    });
  });

  describe('handler.defineProperty', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should defineProperty', function* () {
      assert(app.prop === 1);
      Object.defineProperty(app, 'prop', {
        get() {
          if (!this._prop) {
            this._prop = 0;
          }
          return this._prop++;
        },
        set(prop) {
          if (this._prop) {
            this._prop = this._prop + prop;
          }
        },
      });

      assert(app.prop === 0);
      assert(app.prop === 1);
      app.prop = 2;
      assert(app.prop === 4);
      app.prop = 2;
      assert(app.prop === 7);
    });

    it('should ignore when defineProperty on MockApplication', function* () {
      assert(app.closed === false);
      Object.defineProperty(app, 'closed', {
        value: true,
      });
      assert(app.closed === false);
      assert(!app._app.closed);
    });
  });

  describe('handler.deleteProperty', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should delete property', () => {
      assert(app.shouldBeDelete === true);
      delete app.shouldBeDelete;
      assert(app.shouldBeDelete === undefined);
    });

    it('should ignore when delete property on MockApplication', function* () {
      assert(!app._app.closed);
      assert(app.closed === false);
      delete app.closed;
      assert(!app._app.closed);
      assert(app.closed === false);
    });
  });

  describe('handler.getOwnPropertyDescriptor', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should getOwnPropertyDescriptor', () => {
      const d = Object.getOwnPropertyDescriptor(app, 'a');
      assert(typeof d.get === 'function');
      assert(typeof d.set === 'function');
    });

    it('should ignore when getOwnPropertyDescriptor on MockApplication', function* () {
      const d = Object.getOwnPropertyDescriptor(app, 'closed');
      assert(d.value === false);
    });
  });

  describe('handler.getPrototypeOf', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should getPrototypeOf', () => {
      assert(Object.getPrototypeOf(app) === Object.getPrototypeOf(app._app));
    });
  });

  describe('MOCK_APP_METHOD', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should be used on MockApplication', () => {
      const MOCK_APP_METHOD = [
        'ready',
        'closed',
        'close',
        'agent',
        '_agent',
        '_app',
        'on',
        'once',
      ];
      for (const key of MOCK_APP_METHOD) {
        assert(app[key] !== app._app[key]);
      }
    });
  });

  describe('messenger binding', () => {
    let app;
    const baseDir = path.join(fixtures, 'messenger-binding');
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should send message from app to agent', () => {
      assert.deepEqual(app._agent.received, [
        'send data when app starting',
        'send data when app started',
      ]);
    });

    it('should send message from agent to app', () => {
      assert.deepEqual(app._app.received, [
        'send data when server started',
      ]);
    });

    it('should receive egg-ready', () => {
      assert(app._app.eggReady === true);
      assert(app._agent.eggReady === true);
      assert(app._agent.eggReadyData.baseDir === baseDir);
      assert(app._app.eggReadyData.baseDir === baseDir);
    });

    it('should broadcast message successfully', () => {
      assert(app._app.recievedBroadcastAction === true);
      assert(app._agent.recievedBroadcastAction === true);
      assert(app._app.recievedAgentRecievedAction === true);
    });

    it('should send message from app to app', () => {
      assert(app._app.recievedAppAction === true);
    });

  });
});
