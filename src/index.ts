import path from 'path'
import chokidar from 'chokidar'
import { Configuration as WebpackConfig, Entry as WebpackEntry } from 'webpack'
// @ts-ignore
import RuleSet from 'webpack/lib/RuleSet'
import { Module } from '@nuxt/types'

import { scanComponents, ScanOptions } from './scan'

const componentsModule: Module<ScanOptions> = function (moduleOptions) {
  const scanOptions: ScanOptions = {
    cwd: this.options.srcDir!,
    pattern: 'components/**/*.{vue,ts,tsx,js,jsx}',
    ...moduleOptions
  }

  this.nuxt.hook('build:before', async (builder: any) => {
    let components = await scanComponents(scanOptions)

    this.extendBuild((config) => {
      const { rules }: any = new RuleSet(config.module!.rules)
      const vueRule = rules.find((rule: any) => rule.use && rule.use.find((use: any) => use.loader === 'vue-loader'))
      vueRule.use.unshift({
        loader: require.resolve('./loader'),
        options: {
          componentsDir: this.options.dev ? path.join(this.options.srcDir!, 'components') : /* istanbul ignore next */ undefined,
          getComponents: () => components
        }
      })
      config.module!.rules = rules
    })

    // Watch components directory for dev mode
    // istanbul ignore else
    if (this.options.dev) {
      const watcher = chokidar.watch(path.join(this.options!.srcDir!, 'components'), this.options.watchers!.chokidar)
      watcher.on('all', async (eventName) => {
        if (!['add', 'unlink'].includes(eventName)) {
          return
        }

        components = await scanComponents(scanOptions)
        await builder.generateRoutesAndFiles()
      })

      // Close watcher on nuxt close
      this.nuxt.hook('close', () => {
        watcher.close()
      })
    }
  })

  this.nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
    for (const config of configs.filter(c => ['client', 'modern', 'server'].includes(c.name!))) {
      ((config.entry as WebpackEntry).app as string[]).unshift(path.resolve(__dirname, 'installComponents.js'))
    }
  })
}

export default componentsModule
