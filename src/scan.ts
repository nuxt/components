import path from 'path'
import glob from 'glob'
import { camelCase, kebabCase, upperFirst } from 'lodash'

export interface ScannedComponent {
  name: string

  import: string
  kebabTag: string
  pascalTag: string
}

export interface ScanOptions {
  dir: string
  extensions: string[]
}

export async function scanComponents (options: ScanOptions): Promise<ScannedComponent[]> {
  const globPattern = `**/*.+(${options.extensions.join('|')})`
  const files: string[] = await glob.sync(globPattern, { cwd: options.dir })
  const components: ScannedComponent[] = files.map((file) => {
    const fileName = path.basename(file, path.extname(file))
    const [pascalTag, kebabTag] = [upperFirst(camelCase(fileName)), kebabCase(fileName)]

    return {
      name: pascalTag,
      pascalTag,
      kebabTag,
      import: `() => import('~/components/${file}')`
    }
  })

  return components
}
