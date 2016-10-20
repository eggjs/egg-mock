module.exports = function*() {
  this.body = {
    foo: this.app.config.foo,
    foobar: this.app.config.foobar,
  };
};
