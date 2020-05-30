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
      { path: '~/components', extensions: ['vue'] },
      '~/non-existent',
      { path: '@/components/base', prefix: 'Base' },
      { path: '@/components/icons', prefix: 'Icon', transpile: true /* Only for coverage purpose */ }
    ]
  },

  hooks: {
    'components:dirs' (dirs) {
      dirs.push({
        path: path.resolve(__dirname, 'my-lib/components'),
        extendComponent: _c => ({ ..._c, export: _c.pascalName })
      })
    }
  }
}

export default config
