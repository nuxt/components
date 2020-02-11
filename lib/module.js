const { posix: { join }, resolve } = require('path')
const globby = require('globby')
const chokidar = require('chokidar')

module.exports = function (moduleOptions) {
  const { options } = this.nuxt

  // Merge options and apply defaults
  const { dir, suffixes, extensions, ignore, ignoreNameDetection } = {
    dir: options.dir.components || 'components',
    suffixes: ['global'],
    extensions: ['vue', 'js', 'ts'],
    ignore: [],
    ignoreNameDetection: false,
    ...moduleOptions,
    ...this.options['global-components'],
    ...this.options.globalComponents
  }

  // Compute suffix with extensions array
  const suffixesWithExtensions = getSuffixesWithExtensions(suffixes, extensions)

  // Remove extension
  const removeExtension = name => name.replace(new RegExp(`\\.(${suffixesWithExtensions.join('|')})$`), '')

  // Resolve components dirs
  const dirs = Array.isArray(dir) ? dir : [dir]
  const componentsDir = dirs.map(d => resolve(options.srcDir, d))

  // Patterns
  const patterns = dirs.map(d => join(d, `/**/*.(${suffixesWithExtensions.join('|')})`))

  // Plugin options context
  const pluginOptions = {
    components: [],
    ignoreNameDetection
  }

  // Scans global components and updates context
  const scanGlobalComponents = async () => {
    const fileNames = await globby(patterns, {
      cwd: options.srcDir,
      ignore,
      absolute: false,
      objectMode: true,
      onlyFiles: true
    })

    const globalComponents = fileNames.map(({ name, path }) => {
      return {
        name: toPascal(removeExtension(name)),
        path: `~/${path}`
      }
    })

    const changesDetected = !deepEqual(globalComponents, pluginOptions.components)
    pluginOptions.components = globalComponents
    return changesDetected
  }

  // Hook on builder
  this.nuxt.hook('build:before', async (builder) => {
    // Scan components once
    await scanGlobalComponents()

    // Watch components directory for dev mode
    if (this.options.dev) {
      const watcher = chokidar.watch(componentsDir, options.watchers.chokidar)
      watcher.on('all', async (eventName) => {
        if (!['add', 'unlink'].includes(eventName)) {
          return
        }
        const changesDetected = await scanGlobalComponents()
        if (changesDetected) {
          builder.generateRoutesAndFiles()
        }
      })

      // Close watcher on nuxt close
      this.nuxt.hook('close', () => {
        watcher.close()
      })
    }
  })

  // Add global-components plugin
  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'global-components.js',
    options: pluginOptions
  })
}

function getSuffixesWithExtensions (suffixes, extensions) {
  if (suffixes.length < 1) {
    return extensions
  }

  return suffixes.reduce((acc, suffix) => {
    const suffixWithExtension = extensions.map(extension => `${suffix}${(suffix ? '.' : '')}${extension}`)

    return acc.concat(suffixWithExtension)
  }, [])
}

function deepEqual (a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function toPascal (name) {
  const camelCase = name.replace(/([-_]\w)/g, g => g[1].toUpperCase())
  return camelCase[0].toUpperCase() + camelCase.substr(1)
}

module.exports.meta = require('../package.json')
