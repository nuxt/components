![nuxt-components](https://user-images.githubusercontent.com/904724/80954041-f0d53100-8dfc-11ea-9594-cd621cfdf437.png)

# @nuxt/components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to scan and auto import components for Nuxt.js 2.13+

- [🎲 Play on CodeSandbox](https://githubbox.com/nuxt/components/tree/master/example)
- [🎬 Demonstration video (49s)](https://www.youtube.com/watch?v=lQ8OBrgVVr8)
- [📖 Release Notes](./CHANGELOG.md)

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Options](#options)
- [Library authors](#library-authors)
- [License](#license)

## Features

- Scan and auto import components
- Multiple paths with customizable prefixes and lookup/ignore patterns
- Dynamic import (**aka** Lazy loading) Support
- Hot reloading Support
- Transpiling Support (useful for component [library authors](#library-authors))
- Fully tested!

## Usage

Set the `components` option in `nuxt.config`:

```js
export default {
  components: true
}
```

**Note:** If using nuxt `2.10...2.13`, you have to also manually install and add `@nuxt/components` to `buildModules` inside `nuxt.config`.


**Create your components:**

```bash
components/
  ComponentFoo.vue
  ComponentBar.vue
```

**Use them whenever you want, they will be auto imported in `.vue` files :**

```html
<template>
  <ComponentFoo />
  <component-bar />
</template>
```

No need anymore to manually import them in the `script` section!

See [live demo](https://codesandbox.io/s/nuxt-components-cou9k).

### Dynamic Imports

To make a component imported dynamically (lazy loaded), all you need is adding a `Lazy` prefix in your templates.

> If you think this prefix should be customizable, feel free to create a feature request issue!

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

### Nested Components

If you have components in nested directories:

```bash
components/
  foo/
    Bar.vue
````

The component name will be based on **its filename**:

```html
<Bar />
```

We do recommend to use the directory name in the filename for clarity in order to use `<FooBar />`:

```bash
components/
  foo/
    FooBar.vue
```

If you want to keep the filename as `Bar.vue`, consider using the `prefix` option: (See [directories](#directories) section)

```js
components: [
    '~/components/',
    { path: '~/components/foo/', prefix: 'foo' }
]
```

## Directories

By setting `components: true`, default `~/components` directory will be included.
However you can customize module behaviour by providing directories to scan:

```js
export default {
  components: [
    '~/components', // shortcut to { path: '~/components' }
    { path: '~/components/awesome/', prefix: 'awesome' }
  ],
}
```

Each item can be either string or object. String is shortcut to `{ path }`.

**Note:** Don't worry about ordering or overlapping directories! Components module will take care of it. Each file will be only matched once with longest path.

### Directory Properties

#### path

- Required
- Type: `String`

Path (absolute or relative) to the directory containing your components.

You can use nuxt aliases (`~` or `@`) to refer to directories inside project or directly use a npm package path similar to require.

#### extensions

- Type: `Array<string>`
- Default:
  - Extensions supported by nuxt builder (`builder.supportedExtensions`)
  - Default supported extensions `['vue', 'js']` or `['vue', 'js', 'ts', 'tsx']` depending on your environment

**Example:** Support multi-file component structure

If you prefer to split your SFCs into `.js`, `.vue` and `.css`, you can only enable `.vue` files to be scanned:

```
├── src
│   └── components
│         └── componentC
│           └── componentC.vue
│           └── componentC.js
│           └── componentC.scss
```

```js
// nuxt.config.js
export default {
  components: [
    { path: '~/components', extensions: ['vue'] }
  ]
}
```

#### pattern

- Type: `string` ([glob pattern]( https://github.com/isaacs/node-glob#glob-primer))
- Default: `**/*.${extensions.join(',')}`

Accept Pattern that will be run against specified `path`.

#### ignore

- Type: `Array`
- Items: `string` ([glob pattern]( https://github.com/isaacs/node-glob#glob-primer))
- Default: `[]`

Ignore patterns that will be run against specified `path`.

#### prefix

- Type: `String`
- Default: `''` (no prefix)

Prefix all matched components.

Example below adds `awesome-`/`Awesome` prefix to the name of components in `awesome/` directory.

```js
// nuxt.config.js
export default {
  components: [
      '~/components',
      { path: '~/components/awesome/', prefix: 'awesome' }
  ]
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
- Default: `'auto'`

Transpile specified `path` using [`build.transpile`](https://nuxtjs.org/api/configuration-build#transpile), by default (`'auto'`) it will set `transpile: true` if `node_modules/` is in `path`.

## Library Authors

Making Vue Component libraries with automatic tree-shaking and component registration is now damn easy ✨

This module expose a hook named `components:dirs` so you can easily extend the directory list without updating user configuration in your Nuxt module.

Imagine a directory structure like this:

```bash
| node_modules/
---| awesome-ui/
------| components/
---------| Alert.vue
---------| Button.vue
------| nuxt.js
| pages/
---| index.vue
| nuxt.config.js
```

Then in `awesome-ui/nuxt.js` you can use the `components:dir` hook:

```js
import { join } from 'path'

export default function () {
  this.nuxt.hook('components:dirs', (dirs) => {
    // Add ./components dir to the list
    dirs.push({
      path: join(__dirname, 'components'),
      prefix: 'awesome'
    })
  })
}
```

That's it! Now in your project, you can import your ui library as a Nuxt module in your `nuxt.config.js`:

```js
export default {
  buildModules: [
    '@nuxt/components',
    'awesome-ui/nuxt'
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

It will automatically import the components only if used and also support HMR when updating your components in `node_modules/awesome-ui/components/`.

Next: publish your `awesome-ui` module to [npm](https://www.npmjs.com) and share it with the other Nuxters ✨

## License

[MIT](./LICENSE)

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
