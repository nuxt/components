![nuxt-components](https://user-images.githubusercontent.com/904724/80954041-f0d53100-8dfc-11ea-9594-cd621cfdf437.png)

# @nuxt/components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to scan and auto import components for Nuxt.js 2.10+

- [🎲 Play on CodeSandbox](https://codesandbox.io/s/nuxt-components-cou9k)
- [🎬 Demonstration video (49s)](https://www.youtube.com/watch?v=lQ8OBrgVVr8)
- [📖 Release Notes](./CHANGELOG.md)

## Features

- Scan and auto import components
- Multiple paths with customizable prefixes and lookup/ignore patterns
- Dynamic import (**aka** Lazy loading) Support
- Hot reloading Support
- Transpiling Support (useful for component [libraries' authors](#library-authors))
- Fully tested!

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

### Dynamic imports

To make a component imported dynamically (lazy loaded), all you need is adding a `Lazy` prefix in your templates.

> If you think this prefix should be customizable, feel free to create a feature issue !

You are now being able to easily import a component on-demand :

```html
<template>
  <LazyComponentFoo v-if="foo" />
  <button @click="loadFoo">
    Load Foo
  </button>
</template>

<script>
export default {
  data () {
    return {
      foo: null
    }
  },
  methods: {
    async loadFoo () {
      this.foo = await this.$axios.$get('foo')
    }
  }
}
</script>
```

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
- Type: `String`

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


## Library authors

Shipping a UI librairies with Vue components with automatic tree-shaking is now damn easy to create ✨

This module expose a hook named `components:dirs` so you can easily extend the directory list without updating user configuration in your Nuxt module.

Imagine a directory structure like this:

```bash
| modules/
---| awesome-ui/
------| components/
---------| Alert.vue
---------| Button.vue
------| index.js
| pages/
---| index.vue
| nuxt.config.js
```

Then in `awesome-ui/index.js` you can do use the `components:dir` hook:

```js
import { join } from 'path'

export default function () {
  this.nuxt.hook('components:dirs', (dirs) => {
    // Add ./components dir to the list
    dirs.push({
      path: join(__dirname, 'components'),
      prefix: 'awesome',
      transpile: true
    })
  })
}
```

That's it! Now in your project, you can import your local module in your `nuxt.config.js`:

```js
export default {
  buildModules: [
    '@nuxt/components',
    '@/modules/awesome-ui/'
  ]
}
```

And directly use the module components (prefixed with `awesome-`), our `pages/index.vue`:

```vue
<template>
  <div>
    My <AwesomeButton>UI button</AwesomeButton>!
    <awesome-alert>Here's an alert!</awesome-alert>
  </div>
</template>
```

It will automatically import the components only if used and also support HMR when updating your components in `modules/awesome-ui/components/`.

Next: publish your `awesome-ui` module to [NPM](https://www.npmjs.com) and share it with the other Nuxters ✨

## License

[MIT License](./LICENSE)

Copyright (c) NuxtJS

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
