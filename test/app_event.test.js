'use strict';

const path = require('path');
const request = require('supertest');
const pedding = require('pedding');
const assert = require('assert');
const mm = require('..');
const fixtures = path.join(__dirname, 'fixtures');
const baseDir = path.join(fixtures, 'app-event');

describe('test/app_proxy.test.js', () => {
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
    it('should listen using app.on', done => {
      const baseDir = path.join(fixtures, 'app-start-error');
      const app = mm.app({
        baseDir,
        cache: false,
      });
      app.on('error', err => {
        assert(err.message === 'start error');
        done();
      });
    });

    it('should listen using app.once', done => {
      const baseDir = path.join(fixtures, 'app-start-error');
      const app = mm.app({
        baseDir,
        cache: false,
      });
      app.once('error', err => {
        assert(err.message === 'start error');
        done();
      });
    });
  });
});
