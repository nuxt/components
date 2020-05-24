
import { readFileSync } from 'fs'
import {
  compile,
  parseComponent,
  ModuleOptions as CompilerModuleOptions
} from 'vue-template-compiler'

export async function extractTags (resourcePath: string): Promise<string[]> {
  const tags = new Set<string>()
  const file = (await readFileSync(resourcePath)).toString('utf8')
  const component = parseComponent(file)

  if (component.template) {
    if (component.template.lang === 'pug') {
      try {
        const pug = require('pug')
        component.template.content = pug.render(component.template.content, { filename: resourcePath })
      } catch (err) { /* Ignore compilation errors, they'll be picked up by other loaders */ }
    }
    compile(component.template.content, {
      modules: [{
        postTransformNode: (el) => {
          tags.add(el.tag)
        }
      } as CompilerModuleOptions]
    })
  }

  return [...tags]
}
