import { app } from '../../../../bootstrap';
import assert from 'assert';

describe('test/multi_mock_context.test.ts', () => {
  describe('mockContext', () => {
    it('should only reused once', async function () {
      const currentContext = app.currentContext;
      const ctx1 = app.mockContext();
      const ctx2 = app.mockContext();
      assert(currentContext === ctx1);
      assert(ctx2 !== ctx1);
    });
  });
});
