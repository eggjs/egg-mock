const { MockAgent, setGlobalDispatcher, getGlobalDispatcher } = require('urllib');

let _mockAgent;
let _global;

module.exports = {
  getAgent() {
    if (!_global) {
      _global = getGlobalDispatcher();
    }
    if (!_mockAgent) {
      _mockAgent = new MockAgent();
      setGlobalDispatcher(_mockAgent);
    }
    return _mockAgent;
  },
  async restore() {
    if (!_mockAgent) return;
    if (_global) setGlobalDispatcher(_global);
    const agent = _mockAgent;
    _mockAgent = null;
    await agent.close();
  },
};
