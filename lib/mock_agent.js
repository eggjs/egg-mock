const { MockAgent, setGlobalDispatcher, getGlobalDispatcher } = require('urllib');

let _mockAgent;
let _global;
const APP_HTTPCLIENT_AGENT = Symbol('app.httpclient.agent');

module.exports = {
  getAgent(app) {
    if (!_global) {
      _global = getGlobalDispatcher();
    }
    if (!app?.httpclient?.[APP_HTTPCLIENT_AGENT] && typeof app?.httpclient?.getDispatcher === 'function') {
      // save the raw dispatcher
      app.httpclient[APP_HTTPCLIENT_AGENT] = app.httpclient.getDispatcher();
    }
    if (!_mockAgent) {
      _mockAgent = new MockAgent();
      setGlobalDispatcher(_mockAgent);
      if (typeof app?.httpclient?.setDispatcher === 'function') {
        app.httpclient.setDispatcher(_mockAgent);
      }
    }
    return _mockAgent;
  },
  restore(app) {
    if (!_mockAgent) return;
    if (_global) {
      setGlobalDispatcher(_global);
    }
    if (app?.httpclient?.[APP_HTTPCLIENT_AGENT]) {
      app.httpclient.setDispatcher(app.httpclient[APP_HTTPCLIENT_AGENT]);
    }
    _mockAgent = null;
  },
};
