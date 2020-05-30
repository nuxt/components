import { basename, extname, join, dirname } from 'path'
import glob from 'glob'
import { camelCase, kebabCase, upperFirst } from 'lodash'

const LAZY_PREFIX = 'lazy'
const pascalCase = (str: string) => upperFirst(camelCase(str))
const isWindows = process.platform.startsWith('win')

export interface ScanDir {
  path: string
  pattern?: string
  ignore?: string[]
  prefix?: string
  extendComponent?: (component: Component) => Promise<Component | void> | (Component | void)
}

export interface Component {
  pascalName: string
  kebabName: string
  import: string
  asyncImport: string
  export: string
  filePath: string
  shortPath: string
  async?: boolean
  chunkName: string
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

  for (const { path, pattern, ignore, prefix, extendComponent } of dirs.sort(sortDirsByPathLength)) {
    for (const file of await glob.sync(pattern!, { cwd: path, ignore })) {
      let filePath = join(path, file)

      if (processedPaths.includes(filePath)) {
        continue
      }
      processedPaths.push(filePath)

      let fileName = basename(file, extname(file))
      if (fileName === 'index') {
        fileName = basename(dirname(file), extname(file))
      }

      const pascalName = pascalCase(fileName)
      const kebabName = kebabCase(fileName)
      const shortPath = filePath.replace(srcDir, '').replace(/\\/g, '/').replace(/^\//, '')
      let chunkName = shortPath.replace(extname(shortPath), '')

      if (isWindows) {
        filePath = filePath.replace(/\\/g, '\\\\')
        chunkName = chunkName.replace('/', '_')
      }

      let _c = prefixComponent(prefix, {
        filePath,
        pascalName,
        kebabName,
        chunkName,
        shortPath,
        import: '',
        asyncImport: '',
        export: 'default'
      })

      if (typeof extendComponent === 'function') {
        _c = (await extendComponent(_c)) || _c
      }

      const _import = _c.import || `require('${_c.filePath}').${_c.export}`
      const _asyncImport = _c.asyncImport || `function () { return import('${_c.filePath}' /* webpackChunkName: "${_c.chunkName}" */).then(function(m) { return m['${_c.export}'] || m }) }`

      components.push({
        ..._c,
        import: _import
      })

      components.push(prefixComponent(LAZY_PREFIX, {
        ..._c,
        async: true,
        import: _asyncImport
      }))
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
