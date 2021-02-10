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
      { path: '~/components/global', global: true },
      { path: '~/components/multifile', extensions: ['vue'] },
      '~/non-existent',
      { path: '@/components/base', prefix: 'Base' },
      { path: '@/components/icons', prefix: 'Icon', transpile: true /* Only for coverage purpose */ },
      { path: '@/theme/components', level: 1 }
    ]
  },

  hooks: {
    'components:dirs' (dirs) {
      dirs.push({
        prefix: 'm',
        path: path.resolve(__dirname, 'my-lib/components'),
        extendComponent: _c => ({ ..._c, export: _c.pascalName })
      })
    }
  }
}

export default config
