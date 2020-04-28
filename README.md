# @nuxt/components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to scan and auto import components for Nuxt.js 2.10+

[📖 **Release Notes**](./CHANGELOG.md)

## Usage

Create your components :

```bash
components/
  ComponentFoo.vue
  ComponentBar.vue
```

Use them whenever you want, there will be auto imported in `.vue` files :

```html
<template>
  <ComponentFoo />
  <component-bar />
</template>
```

No need anymore to manually import them in the `script` section !

> ℹ `components` directory is watched, so it even works with reloading (adding or removing a component) !

Here are some cases you may want to still import manually :
 - Third-party library components
 - Lazy load of components
 - Child components in functional templates (See edge case [here](https://github.com/vuejs/vue/issues/7492#issuecomment-379570456))

> ℹ If you import manually, it will override any automatic import that matches the same component name (automatic import will be in fact ignored).

See [live demo](https://codesandbox.io/s/nuxt-components-cou9k).

## Setup

1. Ensure you're using **Nuxt 2.10** or [higher version](https://github.com/nuxt/nuxt.js/releases)

2. Add `@nuxt/components` dependency to your project

```bash
yarn add --dev @nuxt/components # or npm install --save-dev @nuxt/components
```

3. Add `@nuxt/components` to the `buildModules` section of `nuxt.config.js`

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

[github-actions-ci-src]: https://github.com/nuxt/components/workflows/Test/badge.svg
[github-actions-ci-href]: https://github.com/nuxt/components/actions?query=workflow%3ATest

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt/components.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt/components

[license-src]: https://img.shields.io/npm/l/@nuxt/components.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxt/components
