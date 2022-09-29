'use strict';

const path = require('path');
const { execSync } = require('child_process');

describe('test/tsd.test.js', () => {
  it('should tsd run success', () => {
    execSync('tsd', {
      cwd: path.dirname(__dirname),
    });
  });
});
