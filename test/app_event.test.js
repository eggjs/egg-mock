'use strict';

const path = require('path');
const request = require('supertest');
const pedding = require('pedding');
const assert = require('assert');
const sleep = require('ko-sleep');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');
const baseDir = path.join(fixtures, 'app-event');

describe('test/app_event.test.js', () => {
  afterEach(mm.restore);

  describe('after ready', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
      return app.ready();
    });
    after(() => app.close());

    it('should listen by eventByRequest', done => {
      done = pedding(3, done);
      app.once('eventByRequest', done);
      app.on('eventByRequest', done);

      request(app.callback())
        .get('/event')
        .expect(200)
        .expect('done', done);
    });
  });

  describe('before ready', () => {
    let app;
    beforeEach(() => {
      app = mm.app({
        baseDir,
        cache: false,
      });
    });
    afterEach(() => app.ready());
    afterEach(() => app.close());

    it('should listen after app ready', done => {
      done = pedding(2, done);
      app.once('appReady', done);
      app.on('appReady', done);
    });

    it('should listen after app instantiate', done => {
      done = pedding(2, done);
      app.once('appInstantiated', done);
      app.on('appInstantiated', done);
    });
  });

  describe('throw before app init', () => {
    let app;
    beforeEach(() => {
      const baseDir = path.join(fixtures, 'app');
      const customEgg = path.join(fixtures, 'error-framework');
      app = mm.app({
        baseDir,
        customEgg,
        cache: false,
      });
    });
    afterEach(() => app.close());

    it('should listen using app.on', done => {
      app.on('error', err => {
        assert(err.message === 'start error');
        done();
      });
    });

    it('should listen using app.once', done => {
      app.once('error', err => {
        assert(err.message === 'start error');
        done();
      });
    });

    it('should throw error from ready', function* () {
      try {
        yield app.ready();
      } catch (err) {
        assert(err.message === 'start error');
      }
    });

    it('should close when app init failed', function* () {
      app.once('error', () => {});
      yield sleep(1000);
      // app._app is undefined
      yield app.close();
    });

  });
});
