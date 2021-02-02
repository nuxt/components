import fs from 'fs'
import path from 'upath'
import chokidar from 'chokidar'
import type { Configuration as WebpackConfig, Entry as WebpackEntry } from 'webpack'
import type { Module } from '@nuxt/types'

import { requireNuxtVersion } from './compatibility'
import { scanComponents } from './scan'
import type { Options, ComponentsDir } from './types'

const isPureObjectOrString = (val: any) => (!Array.isArray(val) && typeof val === 'object') || typeof val === 'string'
const getDir = (p: string) => fs.statSync(p).isDirectory() ? p : path.dirname(p)

const componentsModule: Module<Options> = function () {
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

    const resolvePath = (dir: any) => nuxt.resolver.resolvePath(dir)

    // Add components/global/ directory
    try {
      const globalDir = getDir(resolvePath('~/components/global'))
      if (!options.dirs.find(dir => resolvePath(dir) === globalDir)) {
        options.dirs.push({
          path: globalDir,
          global: true
        })
      }
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

      // Normalize level
      dirOptions.level = Number(dirOptions.level || 0)

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
          '**/*.stories.{js,ts,jsx,tsx}', // ignore storybook files
          '**/*{M,.m,-m}ixin.{js,ts,jsx,tsx}', // ignore mixins
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
        const vueRule = config.module?.rules.find(rule => rule.test?.toString().includes('.vue'))
        if (!vueRule) {
          throw new Error('Cannot find vue loader')
        }
        if (!vueRule.use) {
          vueRule.use = [{
            loader: vueRule.loader!.toString(),
            options: vueRule.options
          }]
          delete vueRule.loader
          delete vueRule.options
        }
        if (!Array.isArray(vueRule!.use)) {
          // @ts-ignore
          vueRule.use = [vueRule.use]
        }

        // @ts-ignore
        vueRule!.use!.unshift({
          loader: require.resolve('./loader'),
          options: {
            dependencies: nuxt.options.dev ? componentDirs.filter(dir => !dir.global).map(dir => dir.path) : /* istanbul ignore next */[],
            getComponents: () => components
          }
        })
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
