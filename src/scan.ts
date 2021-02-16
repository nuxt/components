import { basename, extname, join, dirname, relative } from 'upath'
import globby from 'globby'
import { kebabCase, pascalCase, splitByCase } from 'scule'
import type { ScanDir, Component } from './types'

export function sortDirsByPathLength ({ path: pathA }: ScanDir, { path: pathB }: ScanDir): number {
  return pathB.split(/[\\/]/).filter(Boolean).length - pathA.split(/[\\/]/).filter(Boolean).length
}

export function prefixComponent (prefix: string = '', { pascalName, kebabName, ...rest }: Component): Component {
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
      const prefixParts = splitByCase(relative(path, dirname(filePath)))
      const fileName = basename(filePath, extname(filePath))
      const fileNameParts = fileName.toLowerCase() === 'index' ? [] : splitByCase(fileName)

      const componentNameParts: string[] = []

      while (prefixParts.length &&
        (prefixParts[0] || '').toLowerCase() !== (fileNameParts[0] || '').toLowerCase()
      ) {
        componentNameParts.push(prefixParts.shift()!)
      }

      const componentName = pascalCase(componentNameParts) + pascalCase(fileNameParts)

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
      const shortPath = relative(srcDir, filePath)
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
      const lazyComponent = prefixComponent('lazy', {
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
