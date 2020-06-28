import path from 'path'
import { NuxtConfig } from '@nuxt/types'
import nuxtComponents from '../../src'

const config: NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    nuxtComponents
  ],

  components: {
    dirs: [
      '~/components',
      { path: '~/components/multifile', extensions: ['vue'] },
      { path: '~/components/global', global: true },
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
