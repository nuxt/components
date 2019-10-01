const { join, resolve } = require('path')
const globby = require('globby')

module.exports = async function (moduleOptions) {
  const { options } = this.nuxt
  const { dir, extensions, ignore } = {
    dir: options.dir.components || 'components',
    extensions: ['global.vue', 'global.js'],
    ignore: [],
    ...moduleOptions,
    ...this.options['global-components'],
    ...this.options.globalComponents
  }

  let globalComponents = await globby(`**/*.(${extensions.join('|')})`, {
    cwd: join(options.srcDir, dir),
    ignore,
    asbsolute: true,
    objectMode: true,
    onlyFiles: true
  })

  globalComponents = globalComponents.map(({ name, path }) => {
    return {
      name: name.replace(new RegExp(`\\.(${extensions.join('|')})$`), ''),
      path: `~/${dir}/${path}`
    }
  })

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'global-components.js',
    options: globalComponents
  })
}

module.exports.meta = require('../package.json')
