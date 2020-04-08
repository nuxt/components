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
  cwd: string
  pattern: string
  ignore?: string | string[]
}

export async function scanComponents ({ cwd, pattern, ignore }: ScanOptions): Promise<Component[]> {
  const files: string[] = await glob.sync(pattern, { cwd, ignore })
  const components: Component[] = files.map((file) => {
    const fileName = path.basename(file, path.extname(file))
    const [pascalTag, kebabTag] = [upperFirst(camelCase(fileName)), kebabCase(fileName)]

    return {
      name: pascalTag,
      pascalTag,
      kebabTag,
      import: `require('~/${file}').default`
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
