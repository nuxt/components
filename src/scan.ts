import path from 'path'
import glob from 'glob'
import { camelCase, kebabCase, upperFirst } from 'lodash'

const pascalCase = (str: string) => upperFirst(camelCase(str))

export interface Component {
  dirName: string
  pascalName: string
  kebabName: string
  import: string
}

export interface ScanOptions {
  cwd: string
  patterns: string[]
  ignore?: string | string[]
}

export async function scanComponents ({ cwd, patterns, ignore }: ScanOptions): Promise<Component[]> {
  const components: Component[] = []

  for (const pattern of patterns) {
    for (const file of await glob.sync(pattern, { cwd, ignore })) {
      const dirName = path.dirname(file)
      const fileName = path.basename(file, path.extname(file))
      let pascalName = pascalCase(fileName)
      let kebabName = kebabCase(fileName)

      // Handle duplicate name components in different dirs by prefixing them
      if (components.some(component => component.pascalName === pascalName)) {
        pascalName = pascalCase(dirName) + pascalName
        kebabName = kebabCase(dirName) + kebabName
      }

      const lazyPrefix = 'lazy'

      components.push(...[
        {
          dirName,
          pascalName,
          kebabName,
          import: `require('~/${file}').default`
        },
        {
          dirName,
          pascalName: upperFirst(lazyPrefix) + pascalName,
          kebabName: lazyPrefix + '-' + kebabName,
          import: `function () { return import('~/${file}') }`
        }
      ])
    }
  }

  return components
}

export function matcher (tags: string[], components: Component[]) {
  return tags.reduce((matches, tag) => {
    const match = components.find(({ pascalName, kebabName }) => [pascalName, kebabName].includes(tag))
    match && matches.push(match)
    return matches
  }, [] as Component[])
}
