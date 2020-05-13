import path from 'path'
import chokidar from 'chokidar'
import { Configuration as WebpackConfig, Entry as WebpackEntry } from 'webpack'
// @ts-ignore
import RuleSet from 'webpack/lib/RuleSet'
import { Module } from '@nuxt/types'

import { requireNuxtVersion } from './compatibility'
import { scanComponents } from './scan'

declare module '@nuxt/types/config/hooks' {
  interface NuxtConfigurationHooks {
      components?: {
        dirs?(dirs: Options['dirs']): void
    }
  }
}

export interface Options {
  dirs: Array<string | {
    path: string
    pattern?: string
    ignore?: string[]
    prefix?: string
    watch?: boolean
    transpile?: boolean
  }>
}

const isPureObjectOrString = (val: any) => (!Array.isArray(val) && typeof val === 'object') || typeof val === 'string'

export default <Module<Options>> function (moduleOptions) {
  requireNuxtVersion.call(this, '2.10')

  const options: Options = {
    dirs: ['~/components'],
    ...moduleOptions,
    ...this.options.components
  }

  this.nuxt.hook('build:before', async (builder: any) => {
    const nuxtIgnorePatterns: string[] = builder.ignore.ignore ? builder.ignore.ignore._rules.map((rule: any) => rule.pattern) : /* istanbul ignore next */ []
    await this.nuxt.callHook('components:dirs', options.dirs)
    const componentDirs = options.dirs.filter(isPureObjectOrString).map((dir) => {
      const dirOptions = typeof dir === 'object' ? dir : { path: dir }
      return {
        ...dirOptions,
        path: this.nuxt.resolver.resolvePath(dirOptions.path),
        pattern: dirOptions.pattern || `**/*.{${builder.supportedExtensions.join(',')}}`,
        ignore: nuxtIgnorePatterns.concat(dirOptions.ignore || [])
      }
    })

    this.options.build!.transpile!.push(...componentDirs.filter(dir => dir.transpile).map(dir => dir.path))

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
