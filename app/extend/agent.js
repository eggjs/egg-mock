'use strict';
const mm = require('mm');
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

  /**
   * @see mm#restore
   * @method Agent#mockRestore
   */
  mockRestore: mm.restore,

  /**
   * @see mm
   * @method Agent#mm
   */
  mm,
};
