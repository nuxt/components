import path from 'path'
import fs from 'fs'
import chokidar from 'chokidar'
import { Configuration as WebpackConfig, Entry as WebpackEntry } from 'webpack'
// @ts-ignore
import RuleSet from 'webpack/lib/RuleSet'
import { Module } from '@nuxt/types'

import { requireNuxtVersion } from './compatibility'
import { scanComponents, ScanDir } from './scan'

export interface ComponentsDir extends ScanDir {
  watch?: boolean
  extensions?: string[]
  transpile?: 'auto' | boolean
}

type componentsDirHook = (dirs: ComponentsDir[]) => void | Promise<void>
type componentsExtendHook = (components: (ComponentsDir|ScanDir)[]) => void | Promise<void>

declare module '@nuxt/types/config/hooks' {
  interface NuxtOptionsHooks {
    'components:dirs'?: componentsDirHook
    'components:extend'?: componentsExtendHook
    components?: {
      dirs?: componentsDirHook
      extend?: componentsExtendHook
    }
  }
}

export interface Options {
  dirs: (string | ComponentsDir)[]
}

declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    components: boolean | Options | Options['dirs']
  }
}

const isPureObjectOrString = (val: any) => (!Array.isArray(val) && typeof val === 'object') || typeof val === 'string'
const getDir = (p: string) => fs.statSync(p).isDirectory() ? p : path.dirname(p)

const componentsModule = <Module> function () {
  const { nuxt } = this
  const { components } = nuxt.options

  /* istanbul ignore if */
  if (!components) {
    return
  }

  requireNuxtVersion(nuxt?.constructor?.version, '2.10')

  const options: Options = {
    dirs: ['~/components'],
    ...Array.isArray(components) ? { dirs: components } : components
  }

  nuxt.hook('build:before', async (builder: any) => {
    const nuxtIgnorePatterns: string[] = builder.ignore.ignore ? builder.ignore.ignore._rules.map((rule: any) => rule.pattern) : /* istanbul ignore next */ []

    await nuxt.callHook('components:dirs', options.dirs)

    // Add components/global/ directory
    try {
      const globalDir = getDir(nuxt.resolver.resolvePath('~/components/global'))
      options.dirs.push({
        path: globalDir,
        global: true
      })
    } catch (err) {
      /* istanbul ignore next */
      nuxt.options.watch.push(path.resolve(nuxt.options.srcDir, 'components', 'global'))
    }

    const componentDirs = options.dirs.filter(isPureObjectOrString).map((dir) => {
      const dirOptions: ComponentsDir = typeof dir === 'object' ? dir : { path: dir }

      let dirPath = dirOptions.path
      try { dirPath = getDir(nuxt.resolver.resolvePath(dirOptions.path)) } catch (err) {}

      const transpile = typeof dirOptions.transpile === 'boolean' ? dirOptions.transpile : 'auto'

      // Normalize global option
      if (dirOptions.global === 'dev') {
        dirOptions.global = nuxt.options.dev
      }

      const enabled = fs.existsSync(dirPath)
      if (!enabled && dirOptions.path !== '~/components') {
        // eslint-disable-next-line no-console
        console.warn('Components directory not found: `' + dirPath + '`')
      }

      const extensions = dirOptions.extensions || builder.supportedExtensions

      return {
        ...dirOptions,
        enabled,
        path: dirPath,
        extensions,
        pattern: dirOptions.pattern || `**/*.{${extensions.join(',')},}`,
        ignore: [
          '**/*.stories.js', // ignore storybook files
          ...nuxtIgnorePatterns,
          ...(dirOptions.ignore || [])
        ],
        transpile: (transpile === 'auto' ? dirPath.includes('node_modules') : transpile)
      }
    }).filter(d => d.enabled)

    nuxt.options.build!.transpile!.push(...componentDirs.filter(dir => dir.transpile).map(dir => dir.path))

    let components = await scanComponents(componentDirs, nuxt.options.srcDir!)
    await nuxt.callHook('components:extend', components)

    // Add loader for tree shaking
    if (componentDirs.some(dir => !dir.global)) {
      this.extendBuild((config) => {
        const { rules }: any = new RuleSet(config.module!.rules)
        const vueRule = rules.find((rule: any) => rule.use && rule.use.find((use: any) => use.loader === 'vue-loader'))
        vueRule.use.unshift({
          loader: require.resolve('./loader'),
          options: {
            dependencies: nuxt.options.dev ? componentDirs.filter(dir => !dir.global).map(dir => dir.path) : /* istanbul ignore next */[],
            getComponents: () => components
          }
        })
        config.module!.rules = rules
      })

      // Add Webpack entry for runtime installComponents function
      nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
        for (const config of configs.filter(c => ['client', 'modern', 'server'].includes(c.name!))) {
          ((config.entry as WebpackEntry).app as string[]).unshift(path.resolve(__dirname, '../lib/installComponents.js'))
        }
      })
    }

    // Watch
    // istanbul ignore else
    if (nuxt.options.dev && componentDirs.some(dir => dir.watch !== false)) {
      const watcher = chokidar.watch(componentDirs.filter(dir => dir.watch !== false).map(dir => dir.path), nuxt.options.watchers!.chokidar)
      watcher.on('all', async (eventName) => {
        if (!['add', 'unlink'].includes(eventName)) {
          return
        }

        components = await scanComponents(componentDirs, nuxt.options.srcDir!)
        await nuxt.callHook('components:extend', components)

        await builder.generateRoutesAndFiles()
      })

      // Close watcher on nuxt close
      nuxt.hook('close', () => {
        watcher.close()
      })
    }

    // Global components

    // Add templates
    const getComponents = () => components
    const templates = [
      'components/index.js',
      'components/plugin.js',
      'vetur/tags.json'
    ]
    for (const t of templates) {
      this[t.includes('plugin') ? 'addPlugin' : 'addTemplate']({
        src: path.resolve(__dirname, '../templates', t),
        fileName: t,
        options: { getComponents }
      })
    }
  })
}

// @ts-ignore
componentsModule.meta = { name: '@nuxt/components' }

export default componentsModule
