'use strict';

module.exports = {
  runInBackground(scope) {
    const promise = this._runInBackground(scope);
    this.app._backgroundTasks.push(promise);
  },
};
