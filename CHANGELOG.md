# Changelog

## [5.10.6](https://github.com/eggjs/egg-mock/compare/v5.10.5...v5.10.6) (2023-02-22)


### Bug Fixes

* disable app close on parallel ([#160](https://github.com/eggjs/egg-mock/issues/160)) ([5a08d33](https://github.com/eggjs/egg-mock/commit/5a08d33ffcbc047ef374a5ab99bee00ad5675808))

## [5.10.5](https://github.com/eggjs/egg-mock/compare/v5.10.4...v5.10.5) (2023-02-16)


### Bug Fixes

* should close app on afterAll hook ([#158](https://github.com/eggjs/egg-mock/issues/158)) ([081b157](https://github.com/eggjs/egg-mock/commit/081b1574c31cfe274083b21a1e11bc81304ab1d5))

## [5.10.4](https://github.com/eggjs/egg-mock/compare/v5.10.3...v5.10.4) (2023-01-31)


### Bug Fixes

* use symbol to access suite app ([#156](https://github.com/eggjs/egg-mock/issues/156)) ([a130dd3](https://github.com/eggjs/egg-mock/commit/a130dd307258df540b65b6d445b56681f69d9232))

## [5.10.3](https://github.com/eggjs/egg-mock/compare/v5.10.2...v5.10.3) (2023-01-30)


### Bug Fixes

* inject failed should make suite/test failed ([#154](https://github.com/eggjs/egg-mock/issues/154)) ([f9f2d4c](https://github.com/eggjs/egg-mock/commit/f9f2d4c5184b2fd2a60485d9333bfefb2c42fabb))

## [5.10.2](https://github.com/eggjs/egg-mock/compare/v5.10.1...v5.10.2) (2023-01-30)


### Bug Fixes

* make sure app ready on parallel mode ([#155](https://github.com/eggjs/egg-mock/issues/155)) ([83c600e](https://github.com/eggjs/egg-mock/commit/83c600e8cb8139a232f1066c2925562574102dbe))

## [5.10.1](https://github.com/eggjs/egg-mock/compare/v5.10.0...v5.10.1) (2023-01-29)


### Bug Fixes

* fix mockContext with headers ([#153](https://github.com/eggjs/egg-mock/issues/153)) ([5e3e816](https://github.com/eggjs/egg-mock/commit/5e3e816395d8be37548d4bb72c3e3dc2d098bee1))

## [5.10.0](https://github.com/eggjs/egg-mock/compare/v5.9.4...v5.10.0) (2023-01-28)


### Features

* add default ua egg-mock/${version} ([#151](https://github.com/eggjs/egg-mock/issues/151)) ([ccb28f5](https://github.com/eggjs/egg-mock/commit/ccb28f5a99148528459f1f8b120254f3feb64561))
* impl setGetAppCallback ([#152](https://github.com/eggjs/egg-mock/issues/152)) ([b7d902c](https://github.com/eggjs/egg-mock/commit/b7d902cf990ee90181f24e9722f42560858118eb))

## [5.9.4](https://github.com/eggjs/egg-mock/compare/v5.9.3...v5.9.4) (2023-01-18)


### Bug Fixes

* use originalUrl to check mock call function request ([#149](https://github.com/eggjs/egg-mock/issues/149)) ([abe1c07](https://github.com/eggjs/egg-mock/commit/abe1c07a2abb4b98c37a34725e4917caafe6dc7e))

## [5.9.3](https://github.com/eggjs/egg-mock/compare/v5.9.2...v5.9.3) (2023-01-18)


### Bug Fixes

* every it should has self ctx ([#150](https://github.com/eggjs/egg-mock/issues/150)) ([bf33c1c](https://github.com/eggjs/egg-mock/commit/bf33c1cbde00b0f10d49184bda305c2c98a58401))

## [5.9.2](https://github.com/eggjs/egg-mock/compare/v5.9.1...v5.9.2) (2023-01-17)


### Bug Fixes

* mocha should be peer deps ([#148](https://github.com/eggjs/egg-mock/issues/148)) ([9a5fcca](https://github.com/eggjs/egg-mock/commit/9a5fcca1ff19f2bc7d74a8122becc1bf0ddfe89d))

## [5.8.4](https://github.com/eggjs/egg-mock/compare/v5.8.3...v5.8.4) (2023-01-12)


### Bug Fixes

* only await app ready when app exists ([#145](https://github.com/eggjs/egg-mock/issues/145)) ([f4ed458](https://github.com/eggjs/egg-mock/commit/f4ed458441449da70fd4108747377b7890dc08fb))

## [5.8.3](https://github.com/eggjs/egg-mock/compare/v5.8.2...v5.8.3) (2023-01-11)


### Bug Fixes

* app should wait for agent ready on parallel mode ([#144](https://github.com/eggjs/egg-mock/issues/144)) ([205e836](https://github.com/eggjs/egg-mock/commit/205e836ba11a869da208c441a9b90edd6e61b3b1))

## [5.8.2](https://github.com/eggjs/egg-mock/compare/v5.8.1...v5.8.2) (2023-01-10)


### Bug Fixes

* ignore bootstrap error on non egg project ([#142](https://github.com/eggjs/egg-mock/issues/142)) ([880c282](https://github.com/eggjs/egg-mock/commit/880c282481024005456074a123b4b1f185971f4c))

## [5.8.1](https://github.com/eggjs/egg-mock/compare/v5.8.0...v5.8.1) (2023-01-09)


### Bug Fixes

* add register.js to files ([#141](https://github.com/eggjs/egg-mock/issues/141)) ([a87e801](https://github.com/eggjs/egg-mock/commit/a87e8019724dbb2401bd41ccf95be26c571e8e8f))

## [5.8.0](https://github.com/eggjs/egg-mock/compare/v5.7.1...v5.8.0) (2023-01-09)


### Features

* use mocha global hook to register before/after ([#140](https://github.com/eggjs/egg-mock/issues/140)) ([9ef65de](https://github.com/eggjs/egg-mock/commit/9ef65de3382c15c5fdeff2e8d0b14eed8144a41b))

## [5.7.1](https://github.com/eggjs/egg-mock/compare/v5.7.0...v5.7.1) (2023-01-07)


### Bug Fixes

* should add egg to peerDependencies ([#139](https://github.com/eggjs/egg-mock/issues/139)) ([2134fc7](https://github.com/eggjs/egg-mock/commit/2134fc73661e4c2de433aceda2ea45811c8bff8b))

## [5.7.0](https://github.com/eggjs/egg-mock/compare/v5.6.0...v5.7.0) (2023-01-03)


### Features

* remove power-assert ([#138](https://github.com/eggjs/egg-mock/issues/138)) ([0c9fad2](https://github.com/eggjs/egg-mock/commit/0c9fad2f7a6f739080f2b996d8f6bb98852af12a))

## [5.6.0](https://github.com/eggjs/egg-mock/compare/v5.5.0...v5.6.0) (2023-01-03)


### Features

* upgrade globby to v11 ([#137](https://github.com/eggjs/egg-mock/issues/137)) ([b0af3eb](https://github.com/eggjs/egg-mock/commit/b0af3eb471a394448236e4cb18863e60218e0d2a))

## [5.5.0](https://github.com/eggjs/egg-mock/compare/v5.4.0...v5.5.0) (2022-12-28)


### Features

* add mockContextScope ([#136](https://github.com/eggjs/egg-mock/issues/136)) ([9db9afa](https://github.com/eggjs/egg-mock/commit/9db9afaadfb73a58d03b3cbdbd0c8c6515e6578a))
