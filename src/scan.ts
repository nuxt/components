import { basename, extname, join, dirname } from 'path'
import globby from 'globby'
import { camelCase, kebabCase, upperFirst } from 'lodash'

const LAZY_PREFIX = 'lazy'
const pascalCase = (str: string) => upperFirst(camelCase(str))
const isWindows = process.platform.startsWith('win')

export interface ScanDir {
  path: string
  pattern?: string | string[]
  ignore?: string[]
  prefix?: string
  global?: boolean,
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
  global: boolean
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
  const filePaths = new Set<string>()
  const scannedPaths: string[] = []

  for (const { path, pattern, ignore = [], prefix, extendComponent, global } of dirs.sort(sortDirsByPathLength)) {
    const resolvedNames = new Map<string, string>()

    for (const _file of await globby(pattern!, { cwd: path, ignore })) {
      let filePath = join(path, _file)

      if (scannedPaths.find(d => filePath.startsWith(d))) {
        continue
      }

      if (filePaths.has(filePath)) { continue }
      filePaths.add(filePath)

      let fileName = basename(filePath, extname(filePath))
      if (fileName === 'index') {
        fileName = basename(dirname(filePath), extname(filePath))
      }

      if (resolvedNames.has(fileName)) {
        // eslint-disable-next-line no-console
        console.warn(`Two component files resolving to the same name \`${fileName}\`:\n` +
          `\n - ${filePath}` +
          `\n - ${resolvedNames.get(fileName)}`
        )
        continue
      }
      resolvedNames.set(fileName, filePath)

      const pascalName = pascalCase(fileName)
      const kebabName = kebabCase(fileName)
      const shortPath = filePath.replace(srcDir, '').replace(/\\/g, '/').replace(/^\//, '')
      let chunkName = shortPath.replace(extname(shortPath), '')

      // istanbul ignore if
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
        export: 'default',
        global: Boolean(global)
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

    scannedPaths.push(path)
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
