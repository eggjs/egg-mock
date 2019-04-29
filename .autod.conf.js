'use strict'

module.exports = {
  write: true,
  prefix: '^',
  devprefix: '^',
  exclude: [
    'test/fixtures',
  ],
  devdep: [
    'autod',
    'egg',
    'egg-bin',
    'eslint',
    'eslint-config-egg',
  ],
  dep: [
    '@types/power-assert',
  ],
  keep: [
  ],
  semver: [
    'egg@1',
  ],
};
