import path from 'path'
import componentsModule from '../../src'

const config = {
  rootDir: path.resolve(__dirname, '../..'),
  buildDIr: path.resolve(__dirname, '.nuxt'),
  srcDir: __dirname,

  buildModules: [
    '@nuxt/typescript-build',
    componentsModule
  ]
}

export default config
