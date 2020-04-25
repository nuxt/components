import path from 'path'
import chokidar from 'chokidar'
import { Configuration as WebpackConfig, Entry as WebpackEntry } from 'webpack'
// @ts-ignore
import RuleSet from 'webpack/lib/RuleSet'
import { Module } from '@nuxt/types'

import { scanComponents } from './scan'

export interface Options {
  dirs: Array<string | {
    path: string
    pattern?: string
    ignore?: string
    prefix?: string
    watch?: boolean
    transpile?: boolean
  }>
}

export default <Module<Options>> function (moduleOptions) {
  const options: Options = {
    dirs: ['~/components'],
    ...moduleOptions
  }

  // Flatten dirs, resolve paths and set default pattern
  const componentDirs = options.dirs.map((dir) => {
    const path = this.nuxt.resolver.resolvePath(typeof dir === 'object' ? dir.path : dir)
    const pattern = (typeof dir === 'object' && dir.pattern) || '**/*.{vue,ts,tsx,js,jsx}'
    return typeof dir === 'object' ? { ...dir, path, pattern } : { path, pattern }
  })

  // Transpile
  const toTranspile = componentDirs.filter(dir => dir.transpile).map(dir => dir.path)
  // istanbul ignore next
  if (toTranspile.length) {
    const transpile = this.options.build!.transpile!
    if (typeof transpile === 'function') {
      this.options.build!.transpile! = ctx => [...transpile(ctx), ...toTranspile]
    } else {
      transpile.push(...toTranspile)
    }
  }

  this.nuxt.hook('build:before', async (builder: any) => {
    let components = await scanComponents(componentDirs)

    this.extendBuild((config) => {
      const { rules }: any = new RuleSet(config.module!.rules)
      const vueRule = rules.find((rule: any) => rule.use && rule.use.find((use: any) => use.loader === 'vue-loader'))
      vueRule.use.unshift({
        loader: require.resolve('./loader'),
        options: {
          dependencies: this.options.dev ? componentDirs.map(dir => dir.path) : /* istanbul ignore next */ [],
          getComponents: () => components
        }
      })
      config.module!.rules = rules
    })

    // Watch
    // istanbul ignore else
    if (this.options.dev && componentDirs.some(dir => dir.watch !== false)) {
      const watcher = chokidar.watch(componentDirs.filter(dir => dir.watch !== false).map(dir => dir.path), this.options.watchers!.chokidar)
      watcher.on('all', async (eventName) => {
        if (!['add', 'unlink'].includes(eventName)) {
          return
        }

        components = await scanComponents(componentDirs)
        await builder.generateRoutesAndFiles()
      })

      // Close watcher on nuxt close
      this.nuxt.hook('close', () => {
        watcher.close()
      })
    }
  })

  // Add Webpack entry for runtime installComponents function
  this.nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
    for (const config of configs.filter(c => ['client', 'modern', 'server'].includes(c.name!))) {
      ((config.entry as WebpackEntry).app as string[]).unshift(path.resolve(__dirname, 'installComponents.js'))
    }
  })
}
