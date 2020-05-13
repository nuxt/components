import path from 'path'
import { Configuration } from '@nuxt/types'
import componentsModule, { Options } from '../../src'

declare module '@nuxt/types' {
  interface Configuration {
    hooks?: {
      components?: {
        dirs?(dirs: Options['dirs']): void
      }
    }
  }
}

const config: Configuration = {
  rootDir: path.resolve(__dirname, '../..'),
  buildDIr: path.resolve(__dirname, '.nuxt'),
  srcDir: __dirname,

  buildModules: ['@nuxt/typescript-build', componentsModule],

  components: {
    dirs: [
      '~/components',
      { path: '@/components/base', prefix: 'Base' },
      { path: '@/components/icons', prefix: 'Icon', transpile: true /* Only for coverage purpose */ }
    ]
  },
  hooks: {
    components: {
      dirs (dirs: Options['dirs']) {
        config._componentsDirsHook = dirs
      }
    }
  }
}

export default config
