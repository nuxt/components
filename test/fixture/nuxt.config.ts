import path from 'path'
import { Configuration } from '@nuxt/types'
import componentsModule from '../../src'

const config: Configuration = {
  rootDir: path.resolve(__dirname, '../..'),
  buildDIr: path.resolve(__dirname, '.nuxt'),
  srcDir: __dirname,

  buildModules: ['@nuxt/typescript-build', componentsModule],

  components: {
    dirs: [
      '~/components',
      '~/non-existent',
      { path: '@/components/base', prefix: 'Base' },
      { path: '@/components/icons', prefix: 'Icon', transpile: true /* Only for coverage purpose */ }
    ]
  }
}

export default config
