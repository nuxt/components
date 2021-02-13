import { basename, extname, join, dirname, relative } from 'upath'
import globby from 'globby'
import { camelCase, kebabCase, upperFirst } from 'lodash'
import type { ScanDir, Component } from './types'

const LAZY_PREFIX = 'lazy'
const pascalCase = (str: string = '') => {
  const isFirstCharUppercase = str[0] === str.toUpperCase()[0]
  const containsHyphens = str.includes('-')
  const shouldTransformToPascal = !isFirstCharUppercase || containsHyphens

  return shouldTransformToPascal ? upperFirst(camelCase(str)) : str
}

function sortDirsByPathLength ({ path: pathA }: ScanDir, { path: pathB }: ScanDir): number {
  return pathB.split(/[\\/]/).filter(Boolean).length - pathA.split(/[\\/]/).filter(Boolean).length
}

function prefixComponent (prefix: string = '', { pascalName, kebabName, ...rest }: Component): Component {
  return {
    pascalName: pascalName.startsWith(prefix) ? pascalName : pascalCase(prefix) + pascalName,
    kebabName: kebabName.startsWith(prefix) ? kebabName : `${kebabCase(prefix)}-${kebabName}`,
    ...rest
  }
}

export async function scanComponents (dirs: ScanDir[], srcDir: string): Promise<Component[]> {
  const components: Component[] = []
  const filePaths = new Set<string>()
  const scannedPaths: string[] = []

  for (const { path, pattern, ignore = [], prefix, extendComponent, global, level } of dirs.sort(sortDirsByPathLength)) {
    const resolvedNames = new Map<string, string>()

    for (const _file of await globby(pattern!, { cwd: path, ignore })) {
      const filePath = join(path, _file)

      if (scannedPaths.find(d => filePath.startsWith(d))) {
        continue
      }

      if (filePaths.has(filePath)) { continue }
      filePaths.add(filePath)

      // Resolve componentName
      let componentName = pascalCase(basename(filePath, extname(filePath)).replace(/^\//g, ''))
      const pathPrefix = pascalCase(relative(path, dirname(filePath)).replace(/\//g, '-'))
      const parentDirName = pascalCase(basename(dirname(filePath)))

      if (['Index', parentDirName].includes(componentName)) {
        componentName = pathPrefix
      } else if (!componentName.startsWith(pathPrefix.replace(/s$/, ''))) {
        componentName = pathPrefix + componentName
      }

      if (resolvedNames.has(componentName)) {
        // eslint-disable-next-line no-console
        console.warn(`Two component files resolving to the same name \`${componentName}\`:\n` +
          `\n - ${filePath}` +
          `\n - ${resolvedNames.get(componentName)}`
        )
        continue
      }
      resolvedNames.set(componentName, filePath)

      const pascalName = pascalCase(componentName)
      const kebabName = kebabCase(componentName)
      const shortPath = filePath.replace(srcDir, '')
      const chunkName = 'components/' + kebabName

      let _c = prefixComponent(prefix, {
        filePath,
        pascalName,
        kebabName,
        chunkName,
        shortPath,
        import: '',
        asyncImport: '',
        export: 'default',
        global: Boolean(global),
        level: Number(level)
      })

      if (typeof extendComponent === 'function') {
        _c = (await extendComponent(_c)) || _c
      }

      const _import = _c.import || `require('${_c.filePath}').${_c.export}`
      const _asyncImport = _c.asyncImport || `function () { return import('${_c.filePath}' /* webpackChunkName: "${_c.chunkName}" */).then(function(m) { return m['${_c.export}'] || m }) }`

      const component = {
        ..._c,
        import: _import
      }
      const lazyComponent = prefixComponent(LAZY_PREFIX, {
        ..._c,
        async: true,
        import: _asyncImport
      })

      // Check if component is already defined, used to overwite if level is inferiour
      const definedComponent = components.find(c => c.pascalName === component.pascalName)
      if (definedComponent && component.level < definedComponent.level) {
        Object.assign(definedComponent, component)
        const definedLazyComponent = components.find(c => c.pascalName === lazyComponent.pascalName)
        definedLazyComponent && Object.assign(definedLazyComponent, lazyComponent)
      } else if (!definedComponent) {
        components.push(component)
        components.push(lazyComponent)
      }
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
