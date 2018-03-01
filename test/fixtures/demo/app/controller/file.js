'use strict';

module.exports = function* () {
  const stream = yield this.getFileStream();
  const fields = stream.fields;
  this.body = {
    fields,
    filename: stream.filename,
    user: this.user,
  };
};
