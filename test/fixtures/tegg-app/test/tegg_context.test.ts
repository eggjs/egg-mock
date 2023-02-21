import assert from 'assert';
import { Context } from 'egg';
import { app, mm } from '../../../../bootstrap';
import { LogService } from '../app/modules/foo/LogService';

describe('test/tegg_context.test.ts', () => {
  let ctx: Context;
  let logService: LogService;
  before(async () => {
    logService = await app.getEggObject(LogService);
  });

  describe('mock ctx property', () => {
    beforeEach(async () => {
      ctx = await app.mockModuleContext();
      mm(ctx.tracer, 'traceId', 'mockTraceId');
    });

    it('should mock ctx work', () => {
      const traceId = logService.getTracerId();
      assert(traceId === 'mockTraceId');
    });
  });

  describe('mockModuleContextWithData', () => {
    let ctx: Context;

    beforeEach(async () => {
      ctx = await app.mockModuleContext({
        tracer: {
          traceId: 'mock_with_data',
        },
        headers: {
          'user-agent': 'mock_agent',
        },
      });
      assert(ctx.tracer.traceId === 'mock_with_data');
      assert(ctx.get('user-agent') === 'mock_agent');
    });

    it('should mock ctx work', () => {
      const traceId = logService.getTracerId();
      assert(traceId === 'mock_with_data');
    });
  });

  describe('mockModuleContextWithHeaders', () => {
    beforeEach(async () => {
      await app.mockModuleContext({
        headers: {
          'user-agent': 'mock_agent',
        },
      });
    });

    it('should mock ctx work', () => {
      assert(app.currentContext.get('user-agent') === 'mock_agent');
    });
  });
});
