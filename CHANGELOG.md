# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
