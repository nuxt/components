import path from 'path'
import fs from 'fs'
import chokidar from 'chokidar'
import { Configuration as WebpackConfig, Entry as WebpackEntry } from 'webpack'
// @ts-ignore
import RuleSet from 'webpack/lib/RuleSet'
import { Module } from '@nuxt/types'

import { requireNuxtVersion } from './compatibility'
import { scanComponents, ScanDir } from './scan'

type componentsDirHook = (dirs: ComponentsDir[]) => void | Promise<void>
type componentsExtendHook = (components: (ComponentsDir|ScanDir)[]) => void | Promise<void>

declare module '@nuxt/types/config/hooks' {
  interface NuxtConfigurationHooks {
    'components:dirs'?: componentsDirHook
    'components:extend'?: componentsExtendHook
    components?: {
      dirs?: componentsDirHook
      extend?: componentsExtendHook
    }
  }
}

export interface ComponentsDir extends ScanDir {
  watch?: boolean
  transpile?: 'auto' | boolean
}

export interface Options {
  dirs: (string | ComponentsDir)[]
}

const isPureObjectOrString = (val: any) => (!Array.isArray(val) && typeof val === 'object') || typeof val === 'string'
const getDir = (p: string) => fs.statSync(p).isDirectory() ? p : path.dirname(p)

const compnentsModule = <Module> function () {
  requireNuxtVersion.call(this, '2.10')

  const { components } = this.options

  const options: Options = {
    dirs: components !== undefined ? ['~/components'] : [],
    ...Array.isArray(components) ? { dirs: components } : components
  }

  this.nuxt.hook('build:before', async (builder: any) => {
    const nuxtIgnorePatterns: string[] = builder.ignore.ignore ? builder.ignore.ignore._rules.map((rule: any) => rule.pattern) : /* istanbul ignore next */ []

    await this.nuxt.callHook('components:dirs', options.dirs)

    const componentDirs = options.dirs.filter(isPureObjectOrString).map((dir) => {
      const dirOptions: ComponentsDir = typeof dir === 'object' ? dir : { path: dir }

      let dirPath = dirOptions.path
      try { dirPath = getDir(this.nuxt.resolver.resolvePath(dirOptions.path)) } catch (err) { }

      const transpile = typeof dirOptions.transpile === 'boolean' ? dirOptions.transpile : 'auto'

      const enabled = fs.existsSync(dirPath)
      if (!enabled && dirOptions.path !== '~/components') {
        // eslint-disable-next-line no-console
        console.warn('Components directory not found: `' + dirPath + '`')
      }

      return {
        ...dirOptions,
        enabled,
        path: dirPath,
        pattern: dirOptions.pattern || `**/*.{${builder.supportedExtensions.join(',')}}`,
        ignore: nuxtIgnorePatterns.concat(dirOptions.ignore || []),
        transpile: (transpile === 'auto' ? dirPath.includes('node_modules') : transpile)
      }
    }).filter(d => d.enabled)

    this.options.build!.transpile!.push(...componentDirs.filter(dir => dir.transpile).map(dir => dir.path))

    let components = await scanComponents(componentDirs, this.options.srcDir!)
    await this.nuxt.callHook('components:extend', components)

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

        components = await scanComponents(componentDirs, this.options.srcDir!)
        await this.nuxt.callHook('components:extend', components)

        await builder.generateRoutesAndFiles()
      })

      // Close watcher on nuxt close
      this.nuxt.hook('close', () => {
        watcher.close()
      })
    }

    // Add templates
    const templates = [
      'components/components.js',
      'components/components.json',
      'vetur/tags.json'
    ]
    for (const t of templates) {
      this.addTemplate({
        src: path.resolve(__dirname, '../templates', t),
        fileName: t,
        options: {
          getComponents: () => components
        }
      })
    }
  })

  // Add Webpack entry for runtime installComponents function
  this.nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
    for (const config of configs.filter(c => ['client', 'modern', 'server'].includes(c.name!))) {
      ((config.entry as WebpackEntry).app as string[]).unshift(path.resolve(__dirname, '../lib/installComponents.js'))
    }
  })
}

// @ts-ignore
compnentsModule.meta = { name: '@nuxt/components' }

export default compnentsModule
