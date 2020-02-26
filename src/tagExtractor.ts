
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
