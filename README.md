# @nuxtjs/global-components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to register global components for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

:warning: **ATTENTION**: This module registers components globally which may impair their performance, use with caution.

## Setup

1. Add `@nuxtjs/global-components` dependency to your project

```bash
yarn add --dev @nuxtjs/global-components # or npm install --save-dev @nuxtjs/global-components
```

2. Add `@nuxtjs/global-components` to the `buildModules` section of `nuxt.config.js`

:warning: If you are using Nuxt older than **v2.9** you have to install module as a `dependency` (No `--dev` or `--save-dev` flags) and also use `modules` section in `nuxt.config.js` instead of `buildModules`.

```js
export default {
  buildModules: [
    // Simple usage
    '@nuxtjs/global-components',

    // With options
    ['@nuxtjs/global-components', { /* module options */ }]
  ]
}
```

### Using top level options

```js
export default {
  buildModules: [
    '@nuxtjs/global-components'
  ],
  globalComponents: {
    /* module options */
  }
}
```

## Options

### `dir`

- Type: `String`
- Default: `components`

The directory to find global components.

### `extensions`

- Type: `Array`
- Default: `['global.vue', 'global.js']`

The extensions that files can contain.

### `ignore`

- Type: `Array`
- Default: `[]`

An array of glob patterns to exclude matches.

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Insipired by [nuxtjs.org](https://github.com/nuxt/nuxtjs.org/tree/master/modules/components)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/global-components/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/global-components

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/global-components.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/global-components

[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt-community/global-components.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt-community/global-components

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/global-components.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/global-components

[license-src]: https://img.shields.io/npm/l/@nuxtjs/global-components.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxtjs/global-components
