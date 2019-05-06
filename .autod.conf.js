'use strict'

module.exports = {
  write: true,
  prefix: '^',
  devprefix: '^',
  exclude: [
    'test/fixtures',
  ],
  dep: [
    '@types/power-assert',
  ],
  devdep: [
    'autod',
    'egg',
    'egg-bin',
    'eslint',
    'eslint-config-egg',
  ],
  ignore: [
    'egg-core',
  ],
  keep: [
  ],
  semver: [
    'egg@1',
  ],
};
