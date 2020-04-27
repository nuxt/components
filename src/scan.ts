import { basename, extname, join } from 'path'
import glob from 'glob'
import { camelCase, kebabCase, upperFirst } from 'lodash'

const LAZY_PREFIX = 'lazy'
const pascalCase = (str: string) => upperFirst(camelCase(str))

export interface ScanDir {
  path: string
  pattern: string
  ignore?: string[]
  prefix?: string
}

export interface Component {
  pascalName: string
  kebabName: string
  import: string
}

export async function scanComponents (dirs: ScanDir[]): Promise<Component[]> {
  const components: Component[] = []

  for (const { path, pattern, ignore, prefix = '' } of dirs) {
    for (const file of await glob.sync(pattern, { cwd: path, ignore })) {
      const fileName = basename(file, extname(file))
      const pascalName = pascalCase(prefix) + pascalCase(fileName)
      const kebabName = (prefix ? kebabCase(prefix) + '-' : '') + kebabCase(fileName)

      components.push({
        pascalName,
        kebabName,
        import: `require('${join(path, file)}').default`
      },
      {
        pascalName: pascalCase(LAZY_PREFIX) + pascalName,
        kebabName: kebabCase(LAZY_PREFIX) + '-' + kebabName,
        import: `function () { return import('${join(path, file)}') }`
      })
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
