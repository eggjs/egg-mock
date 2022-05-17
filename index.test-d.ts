import { expectType } from 'tsd';
import { MockApplication } from '.';
import { app, mock, mm } from './bootstrap';

expectType<MockApplication>(app);
expectType<MockApplication>(mock.app());
expectType<MockApplication>(mm.app());

expectType<void>(app.mockLog());
expectType<void>(app.mockLog('logger'));
expectType<void>(app.mockLog(app.logger));
expectType<void>(app.expectLog('foo string'));
expectType<void>(app.expectLog('foo string', 'coreLogger'));
expectType<void>(app.expectLog('foo string', app.coreLogger));
expectType<void>(app.expectLog(/foo string/));
expectType<void>(app.expectLog(/foo string/, 'coreLogger'));
expectType<void>(app.expectLog(/foo string/, app.coreLogger));
expectType<void>(mm.env('default'));
expectType<void>(mm.env('devserver'));
