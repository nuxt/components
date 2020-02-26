import path from 'path'
import glob from 'glob'
// @ts-ignore
import RuleSet from 'webpack/lib/RuleSet'
import { camelCase, kebabCase, upperFirst } from 'lodash'
import { Module } from '@nuxt/types'

export interface Options {
  prefix?: string
}

const autoImportModule: Module<Options> = async function (moduleOptions) {
  const options = {
    prefix: '',
    ...moduleOptions
  } as Required<Options>

  const componentExtensions = ['vue', 'js', ...this.options.build!.additionalExtensions!]
  const globPattern = `**/${options.prefix || ''}*.+(${componentExtensions.join('|')})`
  const files: string[] = await glob.sync(globPattern, { cwd: path.join(this.options!.srcDir!, 'components') })
  const components = files.map((file) => {
    const fileName = path.basename(file, path.extname(file))
    const [pascalTag, kebabTag] = [upperFirst(camelCase(fileName)), kebabCase(fileName)]

    return {
      name: pascalTag,
      pascalTag,
      kebabTag,
      import: `() => import('~/components/${file}')`
    }
  })

  this.extendBuild((config) => {
    const { rules }: any = new RuleSet(config.module!.rules)
    const vueRule = rules.find((rule: any) => rule.use && rule.use.find((use: any) => use.loader === 'vue-loader'))
    vueRule.use.unshift({ loader: require.resolve('./loader'), options: { components } })
    config.module!.rules = rules
  })
}

export default autoImportModule
