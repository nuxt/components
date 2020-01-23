const { resolve } = require('path')
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

  // Resolve components dir
  const componentsDir = resolve(options.srcDir, dir)

  // Compute suffx with extensions array
  const suffixesWithExtensions = suffixes.reduce(
    (acc, suffix) => acc.concat(extensions.map(extension => `${suffix}.${extension}`)), []
  )

  // Plugin options context
  const pluginOptions = {
    components: [],
    ignoreNameDetection
  }

  // Scans global components and updates context
  const scanGlobalComponents = async () => {
    const fileNames = await globby(`**/*.(${suffixesWithExtensions.join('|')})`, {
      cwd: componentsDir,
      ignore,
      absolute: false,
      objectMode: true,
      onlyFiles: true
    })

    const globalComponents = fileNames.map(({ name, path }) => {
      return {
        name: name.replace(new RegExp(`\\.(${suffixesWithExtensions.join('|')})$`), ''),
        path: `~/${dir}/${path}`
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

function deepEqual (a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

module.exports.meta = require('../package.json')
