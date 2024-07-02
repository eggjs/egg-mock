const { MockAgent, setGlobalDispatcher, getGlobalDispatcher } = require('urllib');

let _mockAgent;
let _global;
const APP_HTTPCLIENT_AGENT = Symbol('app.httpclient.agent');

module.exports = {
  getAgent(app) {
    if (!_global) {
      _global = getGlobalDispatcher();
      if (typeof app?.httpclient?.getDispatcher === 'function') {
        if (!app[APP_HTTPCLIENT_AGENT]) {
          // save the raw dispatcher
          app[APP_HTTPCLIENT_AGENT] = app.httpclient.getDispatcher();
        }
      }
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
  async restore(app) {
    if (!_mockAgent) return;
    if (_global) {
      setGlobalDispatcher(_global);
      if (app?.[APP_HTTPCLIENT_AGENT]) {
        app.httpclient.setDispatcher(app[APP_HTTPCLIENT_AGENT]);
      }
    }
    const agent = _mockAgent;
    _mockAgent = null;
    await agent.close();
  },
};
