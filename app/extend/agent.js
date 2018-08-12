'use strict';
const mm = require('mm');
const supertestRequest = require('../../lib/supertest');
const mockHttpclient = require('../../lib/mock_httpclient');

module.exports = {

  /**
   * mock httpclient
   * @method Agent#mockHttpclient
   * @return {Context} this
   */
  mockHttpclient(...args) {
    if (!this._mockHttpclient) {
      this._mockHttpclient = mockHttpclient(this);
    }
    return this._mockHttpclient(...args);
  },

  mockUrllib(...args) {
    this.deprecate('[egg-mock] Please use app.agent.mockHttpclient instead of app.agent.mockUrllib');
    return this.mockHttpclient(...args);
  },

  /**
   * mock csrf
   * @method App#mockCsrf
   * @return {App} this
   * @sice 1.11
   */
  mockCsrf() {
    this.deprecate('[egg-mock] app.agent not support mockCsrf');
    return this;
  },

  /**
   * @see mm#restore
   * @method App#mockRestore
   */
  mockRestore: mm.restore,

  /**
   * @see mm
   * @method App#mm
   */
  mm,

  /**
   * http request helper
   * @method App#httpRequest
   * @return {SupertestRequest} req - supertest request
   * @see https://github.com/visionmedia/supertest
   */
  httpRequest() {
    return supertestRequest(this);
  },
};
