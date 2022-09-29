const util = require('util');
const { rm } = require('fs/promises');
const { rmSync } = require('fs');

const setTimeoutPromise = util.promisify(setTimeout);

module.exports = {
  async sleep(delay) {
    await setTimeoutPromise(delay);
  },

  async rimraf(filepath) {
    await rm(filepath, { force: true, recursive: true });
  },

  rimrafSync(filepath) {
    rmSync(filepath, { force: true, recursive: true });
  },
};
