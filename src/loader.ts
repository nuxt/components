import { loader as WebpackLoader } from 'webpack'
import loaderUtils from 'loader-utils'
import { extractTags } from './tagExtractor'
import { Component, matcher } from './scan'

interface LoaderOptions {
  componentsDir?: string
  getComponents(): Component[]
}

function install (this: WebpackLoader.LoaderContext, content: string, components: Component[]) {
  const imports = '{' + components.map(c => `${c.pascalName}: ${c.import}`).join(',') + '}'

  let newContent = '/* nuxt-component-imports */\n'
  newContent += `installComponents(component, ${imports})\n`

  // Insert our modification before the HMR code
  const hotReload = content.indexOf('/* hot reload */')
  if (hotReload > -1) {
    content = content.slice(0, hotReload) + newContent + '\n\n' + content.slice(hotReload)
  } else {
    content += '\n\n' + newContent
  }

  return content
}

export default async function loader (this: WebpackLoader.LoaderContext, content: string) {
  this.async()
  this.cacheable()

  if (!this.resourceQuery) {
    this.addDependency(this.resourcePath)

    const { componentsDir, getComponents } = loaderUtils.getOptions(this) as LoaderOptions

    if (componentsDir) {
      this.addDependency(componentsDir)
    }

    const tags = await extractTags(this.resourcePath)
    const matchedComponents = matcher(tags, getComponents())

    if (matchedComponents.length) {
      content = install.call(this, content, matchedComponents)
    }
  }

  this.callback(null, content)
}
