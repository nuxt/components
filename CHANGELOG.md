# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.1](https://github.com/nuxt/components/compare/v0.1.0...v0.1.1) (2020-04-23)


### Bug Fixes

* add webpack entry instead of using nuxt plugin ([eaa4013](https://github.com/nuxt/components/commit/eaa4013541cee918b00c37ea11c7fae9d754fa32))

## 0.1.0 (2020-04-22)


### ⚠ BREAKING CHANGES

* The components will be renamed of snake, kebab case to pascal

### Features

* add option `suffixes` ([ff34db2](https://github.com/nuxt/components/commit/ff34db29ebaf589d35012aeb4053980c0b92fbe0))
* multiple dirs ([#13](https://github.com/nuxt/components/issues/13)) ([7fb4be4](https://github.com/nuxt/components/commit/7fb4be4968ecbca25b2f92b8b6a0c3d6f9571234))
* option to ignore name detection ([82049b3](https://github.com/nuxt/components/commit/82049b3cf0a40b8e7eb20ee254b4eb8ca184d25e))
* snake, kebab case to pascal ([#8](https://github.com/nuxt/components/issues/8)) ([943bb4c](https://github.com/nuxt/components/commit/943bb4cff4faafa97f8c60ddef554d5825575ef7))
* watch components directory and rebuild ([#6](https://github.com/nuxt/components/issues/6)) ([2e49ea8](https://github.com/nuxt/components/commit/2e49ea81e290415f0f11e1d083475dd397f8d237))


### Bug Fixes

* do not lazy load components by default ([882fd94](https://github.com/nuxt/components/commit/882fd945df252ba049c4f33996b3a3d426b623fd))
* empty suffixes ([#14](https://github.com/nuxt/components/issues/14)) ([4325117](https://github.com/nuxt/components/commit/43251174be97f12aa3bd0a366007e781f10e8338))
* make loader result cacheable ([4288992](https://github.com/nuxt/components/commit/4288992887dc551135939f6a366ef78049c05247))
* make options at root level instead of options.scan ([4d66e7c](https://github.com/nuxt/components/commit/4d66e7c6188e06e0be4dda6f60dbb8bcb03fad6c))
* mark loader as not cachable ([50eb5b9](https://github.com/nuxt/components/commit/50eb5b94e2979903a6dd2eeecb201f48a808ce10))
* non-posix pattern given to globby on win32 ([#15](https://github.com/nuxt/components/issues/15)) ([c4f165c](https://github.com/nuxt/components/commit/c4f165cba64eaf8a827ca140d6d98bcd733ababf))
* rebuild with updated components ([4e69e8a](https://github.com/nuxt/components/commit/4e69e8a6c6bfd42bf37796770a864dbb90cf2c93))
* support legacy browsers ([052691c](https://github.com/nuxt/components/commit/052691c8f48cb2051422a45ab3277616bce463f5))
* typo in globby options ([#12](https://github.com/nuxt/components/issues/12)) ([f267120](https://github.com/nuxt/components/commit/f267120ab6e9201a22189b0d0e417a5d5917c4a2))
* **module:** only watch components directory in dev mode ([#9](https://github.com/nuxt/components/issues/9)) ([870835d](https://github.com/nuxt/components/commit/870835d5d5e625644cfdbdd1d75e0c7519b65fe0))
* use `reduce` and `concat` instead of `flatMap` ([911fef5](https://github.com/nuxt/components/commit/911fef56de846f7ac2a3df326761467a27cafc99))
