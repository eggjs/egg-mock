module.exports = function* () {
  const stream = yield this.getFileStream();
  console.log(stream);
  const fields = stream.fields;
  this.body = {
    fields,
    filename: stream.filename,
    user: this.user,
  };
};
