import path from 'path'
import glob from 'glob'
import { camelCase, kebabCase, upperFirst } from 'lodash'

export interface Component {
  name: string

  import: string
  kebabTag: string
  pascalTag: string
}

export interface ScanOptions {
  dir: string
  extensions: string[]
}

export async function scanComponents (options: ScanOptions): Promise<Component[]> {
  const globPattern = `**/*.+(${options.extensions.join('|')})`
  const files: string[] = await glob.sync(globPattern, { cwd: options.dir })
  const components: Component[] = files.map((file) => {
    const fileName = path.basename(file, path.extname(file))
    const [pascalTag, kebabTag] = [upperFirst(camelCase(fileName)), kebabCase(fileName)]

    return {
      name: pascalTag,
      pascalTag,
      kebabTag,
      import: `function () { return import('~/components/${file}') }`
    }
  })

  return components
}

export function matcher (tags: string[], components: Component[]) {
  return tags.reduce((matches, tag) => {
    const match = components.find(({ pascalTag, kebabTag }) => [pascalTag, kebabTag].includes(tag))
    match && matches.push(match)
    return matches
  }, [] as Component[])
}
