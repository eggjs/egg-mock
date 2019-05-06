'use strict';

const path = require('path');
const coffee = require('coffee');
const mock = require('mm');

describe('test/bootstrap-plugin.test.js', () => {

  after(() => mock.restore());

  it('should throw', () => {
    mock(process.env, 'EGG_BASE_DIR', path.join(__dirname, './fixtures/plugin-bootstrap'));

    const testFile = path.join(__dirname, './fixtures/plugin-bootstrap/test.js');

    return coffee.fork(testFile)
      // .debug()
      .expect('stderr', /DO NOT USE bootstrap to test plugin/)
      .expect('code', 1)
      .end();
  });
});
