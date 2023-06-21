const assert = require('assert');
const { app } = require('../../../../bootstrap');
describe('test for app ready failed', () => {
  it('should not print', () => {
    // ...
    assert(app);
  });
});
