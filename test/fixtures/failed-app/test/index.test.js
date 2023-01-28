const assert = require('assert');
const { app } = require('../../../../bootstrap');

describe('test/index.test.ts', () => {
  describe('hook error', () => {
    beforeEach(() => {
      assert.fail('failed hook');
    });

    it('should fail', () => {
      // eslint-disable-next-line no-undef
      assert(app.currentContext);
      assert.fail('failed case');
    });
  });

  describe('mockContext failed', () => {
    before(() => {
      app.mockContextScope = () => {
        throw new Error('mockContextScope error');
      };
    });

    it('foo', () => {
      //...
    });

    it('should not run', () => {
      console.log('it should not run');
    });
  });
});
