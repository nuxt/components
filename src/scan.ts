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

function prefixComponent (prefix: string = '', { pascalName, kebabName, ...rest }: Component): Component {
  return {
    pascalName: pascalName.startsWith(prefix) ? pascalName : pascalCase(prefix) + pascalName,
    kebabName: kebabName.startsWith(prefix) ? kebabName : kebabCase(prefix) + '-' + kebabName,
    ...rest
  }
}

export async function scanComponents (dirs: ScanDir[]): Promise<Component[]> {
  const components: Component[] = []

  for (const { path, pattern, ignore, prefix } of dirs) {
    for (const file of await glob.sync(pattern, { cwd: path, ignore })) {
      const fileName = basename(file, extname(file))
      const pascalName = pascalCase(fileName)
      const kebabName = kebabCase(fileName)

      components.push(
        prefixComponent(prefix, { pascalName, kebabName, import: `require('${join(path, file)}').default` }),
        prefixComponent(LAZY_PREFIX, prefixComponent(prefix, { pascalName, kebabName, import: `function () { return import('${join(path, file)}') }` }))
      )
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
