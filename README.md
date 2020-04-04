# @nuxt/components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to scan and auto import components for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Usage

Create your components :

```bash
components/
  ComponentFoo.vue
  ComponentBar.vue
```

Use them whenever you want, there will be auto imported :

```html
<template>
  <ComponentFoo />
  <component-bar />
</template>
```

No need anymore to manually import them in the `script` section !

> ℹ Components are automatically lazy imported, which means they will be lazy loaded.  
> If you need to not lazy load one of them, simply import it in the standard way, the lazy one will be ignored.

> ℹ `components` directory is watched, so it even works with reloading (adding or removing a component) !

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

### `pattern`

- Type: `String`
- Default: `'components/**/*.{vue,ts,tsx,js,jsx}'`

The glob pattern that will find your components.
This pattern will be run against your [srcDir](https://nuxtjs.org/api/configuration-srcdir)

### `ignore`

- Type: `Array`
- Default: `[]`

An array of glob patterns to exclude files.

## License

[MIT License](./LICENSE)

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
