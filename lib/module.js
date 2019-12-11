const { join, resolve } = require('path')
const globby = require('globby')

module.exports = async function (moduleOptions) {
  const { options } = this.nuxt
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

  const suffixesWithExtensions = suffixes.flatMap(suffix => extensions.map(extension => `${suffix}.${extension}`))

  let globalComponents = await globby(`**/*.(${suffixesWithExtensions.join('|')})`, {
    cwd: join(options.srcDir, dir),
    ignore,
    asbsolute: true,
    objectMode: true,
    onlyFiles: true
  })

  globalComponents = globalComponents.map(({ name, path }) => {
    return {
      name: name.replace(new RegExp(`\\.(${suffixesWithExtensions.join('|')})$`), ''),
      path: `~/${dir}/${path}`
    }
  })

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'global-components.js',
    options: {
      components: globalComponents,
      ignoreNameDetection
    }
  })
}

module.exports.meta = require('../package.json')
