# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.1](https://github.com/nuxt/components/compare/v1.1.0...v1.1.1) (2020-10-22)


### Bug Fixes

* **npm:** component may require wrong webpack version ([3fc657a](https://github.com/nuxt/components/commit/3fc657ab88fe5bfc832e9d0c8c0cd0afe4ee555b))

## [1.1.0](https://github.com/nuxt/components/compare/v1.0.7...v1.1.0) (2020-08-04)


### Features

* ignore storybook stories ([#84](https://github.com/nuxt/components/issues/84)) ([b4d9e11](https://github.com/nuxt/components/commit/b4d9e113f2967507b2c827f57f4564273f96b6e9))


### Bug Fixes

* invalid `webpackChunkName` for global exports ([3fc3709](https://github.com/nuxt/components/commit/3fc3709729310ea3e6d8a3005b8b951045903dfc))

### [1.0.7](https://github.com/nuxt/components/compare/v1.0.6...v1.0.7) (2020-07-05)


### Bug Fixes

* disable loader for global dirs ([#70](https://github.com/nuxt/components/issues/70)) ([78baa92](https://github.com/nuxt/components/commit/78baa92880c3985e0382a35d5d9b67f7fb968e29)), closes [#18](https://github.com/nuxt/components/issues/18)

### [1.0.6](https://github.com/nuxt/components/compare/v1.0.5...v1.0.6) (2020-06-28)


### Bug Fixes

* **types:** extend NuxtOptions and use 2.13 NuxtOptionsHooks ([dd9ec90](https://github.com/nuxt/components/commit/dd9ec90d20b472fe08f88480d84451f36371fc2e))

### [1.0.5](https://github.com/nuxt/components/compare/v1.0.4...v1.0.5) (2020-06-24)


### Bug Fixes

* disable module if no components option provided ([#60](https://github.com/nuxt/components/issues/60)) ([8be7b26](https://github.com/nuxt/components/commit/8be7b261f0c05364ef441ef021f93fb39f24ec82))

### [1.0.4](https://github.com/nuxt/components/compare/v1.0.3...v1.0.4) (2020-06-23)


### Bug Fixes

* ensure requireNuxtVersion skips when currentVersion is nullish ([bf7dbfa](https://github.com/nuxt/components/commit/bf7dbfadd81e261b69e7615cf2cd7a87200e2589))

### [1.0.3](https://github.com/nuxt/components/compare/v1.0.2...v1.0.3) (2020-06-19)


### Bug Fixes

* **installComponents:** avoid function shorthand for IE support (fixes [#56](https://github.com/nuxt/components/issues/56)) ([201914b](https://github.com/nuxt/components/commit/201914bd71b4b4c7215e0da1d705984991a38b53))

### [1.0.2](https://github.com/nuxt/components/compare/v1.0.1...v1.0.2) (2020-06-19)

### [1.0.1](https://github.com/nuxt/components/compare/v1.0.0...v1.0.1) (2020-06-19)


### Bug Fixes

* **plugin:** add missing wrapper ([9e42435](https://github.com/nuxt/components/commit/9e4243577c0da145f8ee5d17a9519b8fe0d70187))

## [1.0.0](https://github.com/nuxt/components/compare/v0.3.4...v1.0.0) (2020-06-18)


### Bug Fixes

* add missing comma for multiple global components ([#54](https://github.com/nuxt/components/issues/54)) ([2822a44](https://github.com/nuxt/components/commit/2822a44dfd18483683320f11d4372f85bb4423b8))

### [0.3.5](https://github.com/nuxt/components/compare/v0.3.4...v0.3.5) (2020-06-18)

### [0.3.4](https://github.com/nuxt/components/compare/v0.3.3...v0.3.4) (2020-06-12)


### Features

* support functional components ([#41](https://github.com/nuxt/components/issues/41)) ([5fe2de6](https://github.com/nuxt/components/commit/5fe2de6aa3cb54055e596657c5cffdf1e27f1c2b))
* support global async components ([#43](https://github.com/nuxt/components/issues/43)) ([6dfef95](https://github.com/nuxt/components/commit/6dfef95fbc818e8047db698acba484944340d253))


### Bug Fixes

* disable telemetry for example ([73fe953](https://github.com/nuxt/components/commit/73fe9537c0280344433878642f04a14401630204))
* provide default value for versions ([16eb18a](https://github.com/nuxt/components/commit/16eb18ab4f30581518be56b30be5beb5c01ac473))

### [0.3.3](https://github.com/nuxt/components/compare/v0.3.2...v0.3.3) (2020-06-01)


### Bug Fixes

* **build:** add loader entrypoint ([b2275bb](https://github.com/nuxt/components/commit/b2275bb4deb6f777609d5bb08be0bf4614bbc32d))

### [0.3.2](https://github.com/nuxt/components/compare/v0.3.1...v0.3.2) (2020-06-01)


### Features

* support `dir.extensions` ([#32](https://github.com/nuxt/components/issues/32)) ([0b76ddd](https://github.com/nuxt/components/commit/0b76dddd5513ee9048c73142d8fbafb383d36f6f))
* use globby ([#33](https://github.com/nuxt/components/issues/33)) ([cdac9b9](https://github.com/nuxt/components/commit/cdac9b9856fad581d3392042c307d3839288edb7))


### Bug Fixes

* **scan:** support index.{ext} ([#30](https://github.com/nuxt/components/issues/30)) ([8fcf984](https://github.com/nuxt/components/commit/8fcf984487b7babef1b58e6a5fca172f8e96d5b4))

### [0.3.1](https://github.com/nuxt/components/compare/v0.3.0...v0.3.1) (2020-05-29)


### Features

* components array and simplify usage ([#27](https://github.com/nuxt/components/issues/27)) ([6fc2ba0](https://github.com/nuxt/components/commit/6fc2ba0ec5b8d672cd722b60e014079904698458))

## [0.3.0](https://github.com/nuxt/components/compare/v0.2.5...v0.3.0) (2020-05-25)


### Features

* add pug support ([#21](https://github.com/nuxt/components/issues/21)) ([52584dd](https://github.com/nuxt/components/commit/52584dda4ea949e307fbe7880bdc5322e147c453))

### [0.2.5](https://github.com/nuxt/components/compare/v0.2.4...v0.2.5) (2020-05-21)


### Bug Fixes

* add missing `components:extend` hook call for initial build ([9a29c8b](https://github.com/nuxt/components/commit/9a29c8bdbe505f4a95cc0585817b37bdf92bbba8))

### [0.2.4](https://github.com/nuxt/components/compare/v0.2.3...v0.2.4) (2020-05-20)


### Features

* `components:extend` hook ([462834f](https://github.com/nuxt/components/commit/462834f7cdd77fadad842367db9bceb7cdad6637))
* auto generate components.json, global plugin for tests and vetur tags ([#14](https://github.com/nuxt/components/issues/14)) ([12d546d](https://github.com/nuxt/components/commit/12d546d3f98183626693f3b4c0c13aadef7afc93))
* support `extendComponent` option for scan ([4baa840](https://github.com/nuxt/components/commit/4baa8405800e711bcf58c799f85e3954b0a3c741))


### Bug Fixes

* don't override imports if extendComponent already provided ([01959b1](https://github.com/nuxt/components/commit/01959b16c554408fd78c1bf1c2248f8e806e0275))
* properly resolve components dir name and warn about non existent dirs ([#12](https://github.com/nuxt/components/issues/12)) ([1ffea77](https://github.com/nuxt/components/commit/1ffea77fb3a800a4e14670d651a615c2862a6540))

### [0.2.3](https://github.com/nuxt/components/compare/v0.2.2...v0.2.3) (2020-05-18)


### Features

* set chunk name for async components ([3cb6aaa](https://github.com/nuxt/components/commit/3cb6aaaec83d9641ebd85b22e6e4bad4607bc33b))


### Bug Fixes

* remove moduleOptions to only use components key ([58c7e26](https://github.com/nuxt/components/commit/58c7e26f72576dfbbcaf790f332a73f73090936a))

### [0.2.2](https://github.com/nuxt/components/compare/v0.2.1...v0.2.2) (2020-05-17)


### Bug Fixes

* **scan:** use unix paths for windows ([9b5e6c6](https://github.com/nuxt/components/commit/9b5e6c6ea6bdd38dd03156428dc9c917165b1b45))

### [0.2.1](https://github.com/nuxt/components/compare/v0.2.0...v0.2.1) (2020-05-13)


### Features

* add components:dirs hook ([#6](https://github.com/nuxt/components/issues/6)) ([ed83955](https://github.com/nuxt/components/commit/ed8395569e81691147872d5d08aeec61ad3ea756))

## [0.2.0](https://github.com/nuxt/components/compare/v0.1.2...v0.2.0) (2020-04-30)


### Features

* implements new specs ([#2](https://github.com/nuxt/components/issues/2)) ([f4e5972](https://github.com/nuxt/components/commit/f4e5972188cd14db226b93fca45b7a3f4e36cdc7))
* throw error if nuxt version not supported ([757af3c](https://github.com/nuxt/components/commit/757af3c7f793d28cfdc22f91af0d0ebccbdde05d))

### [0.1.2](https://github.com/nuxt/components/compare/v0.1.1...v0.1.2) (2020-04-24)


### Bug Fixes

* fix IE compatibility ([7fa2785](https://github.com/nuxt/components/commit/7fa278578b2bb018f26b31adda25f59860a310b8))

### [0.1.1](https://github.com/nuxt/components/compare/v0.1.0...v0.1.1) (2020-04-23)


### Bug Fixes

* add webpack entry instead of using nuxt plugin ([eaa4013](https://github.com/nuxt/components/commit/eaa4013541cee918b00c37ea11c7fae9d754fa32))

## [0.1.0](https://github.com/nuxt/components/tree/v0.1.0) (2020-04-22)
