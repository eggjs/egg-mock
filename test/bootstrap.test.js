'use strict';

const path = require('path');
const baseDir = process.env.EGG_BASE_DIR = path.join(__dirname, './fixtures/app');
const { app, assert, mm, mock } = require('../bootstrap');

describe('test/bootstrap.test.js', () => {
  it('should create app success', () => {
    assert(app.baseDir === baseDir);
  });

  it('should mock and mm success', () => {
    assert(app.baseDir === baseDir);
    mm(app, 'baseDir', 'foo');
    assert(app.baseDir === 'foo');
    mock(app, 'baseDir', 'bar');
    assert(app.baseDir === 'bar');
  });

  it('should afterEach(mm.restore) success', () => {
    assert(app.baseDir === baseDir);
  });

  it('should assert success', done => {
    try {
      assert(app.baseDir !== baseDir);
    } catch (err) {
      done();
    }
  });

  describe('backgroundTasksFinished()', () => {
    it('should wait for background task 1 finished', function* () {
      yield app.httpRequest()
        .get('/counter')
        .expect(200)
        .expect({ counter: 0 });
      yield app.httpRequest()
        .get('/counter/plus')
        .expect(200)
        .expect({ counter: 0 });
    });

    it('should wait for background task 2 finished', function* () {
      yield app.httpRequest()
        .get('/counter')
        .expect(200)
        .expect({ counter: 1 });
      yield app.httpRequest()
        .get('/counter/minus')
        .expect(200)
        .expect({ counter: 1 });
    });

    it('should wait for background task 3 finished', function* () {
      yield app.httpRequest()
        .get('/counter')
        .expect(200)
        .expect({ counter: 0 });
      app.mockContext({ superMan: true });
      yield app.httpRequest()
        .get('/counter/plus')
        .expect(200)
        .expect({ counter: 0 });
    });

    it('should all reset', function* () {
      yield app.httpRequest()
        .get('/counter')
        .expect(200)
        .expect({ counter: 10 });
    });

    it('should always return promise instance', () => {
      let p = app.backgroundTasksFinished();
      assert(p.then);
      p = app.backgroundTasksFinished();
      assert(p.then);
      p = app.backgroundTasksFinished();
      assert(p.then);
    });
  });
});
