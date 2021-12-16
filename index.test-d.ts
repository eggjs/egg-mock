import { expectType } from 'tsd';
import mm, { MockApplication } from '.';

const app = mm.app();

expectType<MockApplication>(app);
expectType<void>(app.mockLog());
expectType<void>(app.mockLog('logger'));
expectType<void>(app.mockLog(app.logger));
expectType<void>(app.expectLog('foo string'));
expectType<void>(app.expectLog('foo string', 'coreLogger'));
expectType<void>(app.expectLog('foo string', app.coreLogger));
expectType<void>(app.expectLog(/foo string/));
expectType<void>(app.expectLog(/foo string/, 'coreLogger'));
expectType<void>(app.expectLog(/foo string/, app.coreLogger));
