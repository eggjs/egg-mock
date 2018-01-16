exports.get = function* () {
  this.body = this.user;
};

exports.post = function* () {
  this.body = {
    user: this.user,
    params: this.request.body,
  };
};
