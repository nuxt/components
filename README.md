# @nuxt/components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to scan and auto import components for Nuxt.js 2.10+

[📖 **Release Notes**](./CHANGELOG.md)



## Features

- Scan and auto import components
- Multiple paths with customizable prefixes and lookup/ignore patterns
- Dynamic import (**aka** Lazy loading) Support
- Hot reloading Support
- Transpiling Support (useful for component libraries' authors)
- Fully tested !


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

### Using top level options

```js
export default {
  buildModules: [
    '@nuxt/components',
  ],
  components: {
    /* module options */
  }
}
```

## Options

### `dirs`

- Type: `Array`
  - Items: `String` or `Object` (see definition below)
- Default: `['~/components']`

List of directories to scan, with customizable options when using `Object` syntax.

`String` items are shortcut to `Object` with only `path` provided :

```js
'~/components' === { path: '~/components' }
```



#### `Object` syntax properties

#### path

- Required
- Type: `String

Path (absolute or relative) to the directory containing your components.

We highly recommend using Nuxt aliases : 

| Alias        | Directory                                               |
| ------------ | ------------------------------------------------------- |
| `~` or `@`   | [srcDir](https://nuxtjs.org/api/configuration-srcdir)   |
| `~~` or `@@` | [rootDir](https://nuxtjs.org/api/configuration-rootdir) |

#### pattern

- Type: `String` (must follow glob pattern style : https://github.com/isaacs/node-glob#glob-primer)  
- Default: `**/*.${extensions.join(',')}`
  - `extensions` being Nuxt `builder.supportedExtensions`
  - Resulting in `**/*.{vue,js}` or `**/*.{vue,js,ts,tsx}` depending on your environment

Accept Pattern that will be run against specified `path`.

#### ignore

- Type: `Array`
- Items: `String` (must follow glob pattern style : https://github.com/isaacs/node-glob#glob-primer)
- Default: `[]`

Ignore patterns that will be run against specified `path`.

#### prefix

- Type: `String`
- Default: `''` (no prefix)

Prefix components for specified `path`.

```js
// nuxt.config.js
export default {
  components: {
    dirs: [
      '~/components',
      {
        path: '~/components/awesome/',
        prefix: 'awesome'
      }
    ]
  }
}
```

```bash
components/
  awesome/
    Button.vue
  Button.vue
```

```html
<template>
  <div>
    <AwesomeButton>Click on me 🤘</AwesomeButton>
    <Button>Click on me</Button>
  </div>
</template>
```

#### watch

- Type: `Boolean`
- Default: `true`

Watch specified `path` for changes, including file additions and file deletions.

#### transpile

- Type: `Boolean`
- Default: `false`

Transpile specified `path` using [`build.transpile`](https://nuxtjs.org/api/configuration-build#transpile).

Useful for library authors who want to leverage `@nuxt/components` to add auto import feature of their components.



## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nuxt/components/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxt/components

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxt/components.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxt/components

[github-actions-ci-src]: https://img.shields.io/github/workflow/status/nuxt/typescript/test?label=ci&style=flat-square
[github-actions-ci-href]: https://github.com/nuxt/components/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt/components.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt/components

[license-src]: https://img.shields.io/npm/l/@nuxt/components.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxt/components
