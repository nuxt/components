<%= options.getComponents().map(c => {
  const magicComments = [
    `webpackChunkName: "${c.chunkName}"`,
    c.prefetch === true || typeof c.prefetch === 'number' ? `webpackPrefetch: ${c.prefetch}` : false,
    c.preload === true || typeof c.preload === 'number' ? `webpackPreload: ${c.preload}` : false,
  ].filter(Boolean).join(', ')
  const filePath = c.isAbsolute ? c.filePath : `../${relativeToBuild(c.filePath)}`
  if (c.isAsync === true || (!isDev /* prod fallback */ && c.isAsync === null)) {
    const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
    const asyncImport = `() => import('${filePath}' /* ${magicComments} */).then(c => wrapFunctional(${exp}))`
    return `export const ${c.pascalName} = ${asyncImport}`
  } else {
    const exp = c.export === 'default' ? `default as ${c.pascalName}` : c.pascalName
    return `export { ${exp} } from '${filePath}'`
  }
}).join('\n') %>

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
