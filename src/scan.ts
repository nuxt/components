import { basename, extname, join } from 'path'
import glob from 'glob'
import { camelCase, kebabCase, upperFirst } from 'lodash'

const LAZY_PREFIX = 'lazy'
const pascalCase = (str: string) => upperFirst(camelCase(str))
const isWindows = process.platform.startsWith('win')

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
  filePath: string,
  async?: boolean
}

function sortDirsByPathLength ({ path: pathA }: ScanDir, { path: pathB }: ScanDir): number {
  return pathB.split(/[\\/]/).filter(Boolean).length - pathA.split(/[\\/]/).filter(Boolean).length
}

function prefixComponent (prefix: string = '', { pascalName, kebabName, ...rest }: Component): Component {
  return {
    pascalName: pascalName.startsWith(prefix) ? pascalName : pascalCase(prefix) + pascalName,
    kebabName: kebabName.startsWith(prefix) ? kebabName : kebabCase(prefix) + '-' + kebabName,
    ...rest
  }
}

export async function scanComponents (dirs: ScanDir[], srcDir: string): Promise<Component[]> {
  const components: Component[] = []
  const processedPaths: string[] = []

  for (const { path, pattern, ignore, prefix } of dirs.sort(sortDirsByPathLength)) {
    for (const file of await glob.sync(pattern, { cwd: path, ignore })) {
      let filePath = join(path, file)

      if (processedPaths.includes(filePath)) {
        continue
      }
      processedPaths.push(filePath)

      const fileName = basename(file, extname(file))
      const pascalName = pascalCase(fileName)
      const kebabName = kebabCase(fileName)
      const shortPath = filePath.replace(srcDir, '').replace(/\\/g, '/').replace(/^\//, '')

      let chunkName = shortPath.replace(extname(shortPath), '')
      if (isWindows) {
        filePath = filePath.replace(/\\/g, '\\\\')
        chunkName = chunkName.replace('/', '_')
      }

      const meta = { filePath, pascalName, kebabName, shortPath }
      components.push(
        prefixComponent(prefix, { ...meta, import: `require('${filePath}').default` }),
        prefixComponent(LAZY_PREFIX, prefixComponent(prefix, { ...meta, async: true, import: `function () { return import('${filePath}' /* webpackChunkName: "${chunkName}" */) }` }))
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
