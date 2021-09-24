import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { pascalCase } from 'scule'
import { createFilter } from '@rollup/pluginutils'
import type { FilterPattern } from '@rollup/pluginutils'
import { Component } from './types'
export const DISABLE_COMMENT = '/* nuxt-components disabled */'

export interface Options {
  findComponent(name: string): Component | void | Promise<Component | void>
  include?: FilterPattern
  exclude?: FilterPattern
}

export const loader = createUnplugin<Options>((options) => {
  const filter = createFilter(
    options?.include || [/\.vue$/, /\.vue\?vue/],
    options?.exclude || [/node_modules/, /\.git/, /\.nuxt/]
  )

  return {
    name: 'nuxt-components-loader',
    enforce: 'post',

    transformInclude (id) {
      return filter(id)
    },

    async transform (code, id) {
      if (code.includes(DISABLE_COMMENT)) {
        return
      }

      const s = new MagicString(code)

      let no = 0
      const componentPaths: string[] = []
      const prepend: string[] = []

      for (const match of code.matchAll(/_c\([\s\n\t]*['"](.+?)["']([,)])/g)) {
        const [full, matchedName, append] = match

        if (match.index != null && matchedName && !matchedName.startsWith('_')) {
          const start = match.index
          const end = start + full.length
          const name = pascalCase(matchedName)
          componentPaths.push(name)
          const component = await options!.findComponent(name)
          if (component && !id.startsWith(component.filePath)) {
            const varName = `__nuxt_components_${no}`
            prepend.push(`import ${varName} from "${component.filePath}"`)
            no += 1
            s.overwrite(start, end, `_c(${varName}${append}`)
          }
        }
      }

      if (!prepend.length) {
        return null
      }

      s.prepend(`${DISABLE_COMMENT}${prepend.join(';')};`)
      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          includeContent: true
        })
      }
    }
  }
})
