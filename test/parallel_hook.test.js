'use strict';

const path = require('path');
const coffee = require('coffee');
const mock = require('mm');

describe('test/bootstrap-plugin.test.js', () => {

  after(() => mock.restore());

  it('should throw', async () => {
    return coffee.fork(require.resolve('mocha/bin/mocha'), [
      '-r', path.join(__dirname, '../lib/parallel/agent_register'),
      '--parallel', '--jobs', '2', '--exit',
    ], {
      cwd: path.join(__dirname, './fixtures/apps/parallel-test'),
    })
      // .debug()
      .expect('code', 0)
      .expect('stdout', /3 passing/)
      .end();
  });
});
