import path from 'path'
// @ts-ignore
import RuleSet from 'webpack/lib/RuleSet'
import { Module } from '@nuxt/types'

import { scanComponents, ScanOptions } from './scan'

export interface Options {
  scan?: ScanOptions
}

const autoImportModule: Module<Options> = async function (_moduleOptions) {
  const extensions = ['vue', 'js', ...this.options.build!.additionalExtensions!]
  const dir = path.join(this.options!.srcDir!, 'components')

  const components: any[] = await scanComponents({
    extensions,
    dir
  })

  this.extendBuild((config) => {
    const { rules }: any = new RuleSet(config.module!.rules)
    const vueRule = rules.find((rule: any) => rule.use && rule.use.find((use: any) => use.loader === 'vue-loader'))
    vueRule.use.unshift({ loader: require.resolve('./loader'), options: { components } })
    config.module!.rules = rules
  })
}

export default autoImportModule
