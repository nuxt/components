const fs = require('fs')
const compiler = require('vue-template-compiler')
const loaderUtils = require('loader-utils')

function match (tags: any, components: any) {
  return tags.reduce((matches: any, tag: any) => {
    const match = components.find(({ pascalTag, kebabTag }: any) => [pascalTag, kebabTag].includes(tag))
    match && matches.push(match)
    return matches
  }, [] as any[])
}

function install (this: any, content: any, components: any) {
  const imports = '{' + components.map((c: any) => `${c.name}: ${c.import}`).join(',') + '}'

  if (Object.keys(imports).length) {
    let newContent = '/* auto-component-imports-loader */\n'
    newContent += `import installComponents from ${loaderUtils.stringifyRequest(this, '!' + require.resolve('./runtime/installComponents'))}\n`
    newContent += `installComponents(component, ${imports})\n`

    // Insert our modification before the HMR code
    const hotReload = content.indexOf('/* hot reload */')
    if (hotReload > -1) {
      content = content.slice(0, hotReload) + newContent + '\n\n' + content.slice(hotReload)
    } else {
      content += '\n\n' + newContent
    }
  }

  return content
}

module.exports = async function (this: any, content: any, sourceMap: any) {
  this.async()
  this.cacheable()

  if (!this.resourceQuery) {
    this.addDependency(this.resourcePath)

    const tags = new Set()
    const file = (await fs.readFileSync(this.resourcePath)).toString('utf8')
    const component = compiler.parseComponent(file)

    if (component.template) {
      compiler.compile(component.template.content, {
        modules: [{
          postTransformNode: (node: any) => {
            tags.add(node.tag)
          }
        }]
      })

      const { components } = loaderUtils.getOptions(this)
      const matchedComponents = match([...tags], components)

      if (matchedComponents.length) {
        content = install.call(this, content, matchedComponents)
      }
    }
  }

  this.callback(null, content, sourceMap)
}
