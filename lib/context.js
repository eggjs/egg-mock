'use strict';

let eggUtils = require('egg-core').utils;
if (!eggUtils) {
  // try to support egg-core@3
  eggUtils = require('egg-core/lib/utils');
}

module.exports = {
  runInBackground(scope) {
    /* istanbul ignore next */
    const taskName = scope._name || scope.name || eggUtils.getCalleeFromStack(true);
    scope._name = taskName;
    const promise = this._runInBackground(scope);
    this.app._backgroundTasks.push(promise);
  },
};
