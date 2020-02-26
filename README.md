# @nuxt/components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to register global components for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Usage

Suffix your components with `.global.{ext}` to declare your global components.

```bash
components/
  my-component.vue # local component, import it to use it
  my-button.global.vue # global component, no need to register it!
```

See [live demo](https://codesandbox.io/s/nuxtjs-components-ujtoq).

## Setup

1. Add `@nuxt/components` dependency to your project

```bash
yarn add --dev @nuxt/components # or npm install --save-dev @nuxt/components
```

2. Add `@nuxt/components` to the `buildModules` section of `nuxt.config.js`

```js
export default {
  buildModules: [
    // Simple usage
    '@nuxt/components',

    // With options
    ['@nuxt/components', { /* module options */ }]
  ]
}
```

:warning: If you are using Nuxt **< v2.9** you have to install the module as a `dependency` (No `--dev` or `--save-dev` flags) and use `modules` section in `nuxt.config.js` instead of `buildModules`.

### Using top level options

```js
export default {
  buildModules: [
    '@nuxt/components'
  ],
  globalComponents: {
    /* module options */
  }
}
```

## Options

### `dir`

- Type: `String|Array`
- Default: `components`

A list of directories to find components inside your nuxt project.

### `suffixes`

- Type: `Array`
- Default: `['global']`

The suffixes that files can contain.

### `extensions`

- Type: `Array`
- Default: `['vue', 'js', 'ts']`

The extensions that files can contain.

### `ignore`

- Type: `Array`
- Default: `[]`

An array of glob patterns to exclude matches.

### `ignoreNameDetection`

- Type: `Boolean`
- Default: `false`

Ignore name detection using prototype names.

## License

[MIT License](./LICENSE)

Insipired by [nuxtjs.org](https://github.com/nuxt/nuxtjs.org/tree/master/modules/components)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt/components/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxt/components

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxt/components.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxt/components

[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt/components.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt/components

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt/components.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt/components

[license-src]: https://img.shields.io/npm/l/@nuxt/components.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxt/components
