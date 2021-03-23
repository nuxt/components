<%= options.getComponents().map(c => {
  const exp = c.pascalName === c.export ? c.pascalName : `${c.export} as ${c.pascalName}`
  return `export { ${exp} } from '../${relativeToBuild(c.filePath)}'`
}).join('\n') %>

<%= options.getComponents().map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `export const Lazy${c.pascalName} = import('../${relativeToBuild(c.filePath)}' /* webpackChunkName: "${c.chunkName}" */).then(c => wrapFunctional(${exp}))`
}).join('\n') %>

// nuxt/nuxt.js#8607
export function wrapFunctional(options) {
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
