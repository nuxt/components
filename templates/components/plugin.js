import Vue from 'vue'
<% const components = options.getComponents() %>

const getWrapperFor = (name) => (options) => {
  if (!options.functional) return options

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    name: `${name}Wrapper`,
    render(h) {
      const attrs = Object.fromEntries(Object.entries(this.$attrs).filter(([key]) => !propKeys.includes(key)))
      const props = Object.fromEntries(Object.entries(this.$attrs).filter(([key]) => propKeys.includes(key)))

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}

const components = {
<%= components.map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `  ${c.pascalName.replace(/^Lazy/, '')}: () => import('../${relativeToBuild(c.filePath)}' /* webpackChunkName: "${c.chunkName}" */).then(c => ${exp}).then(getWrapperFor('${c.pascalName}'))`
}).join(',\n') %>
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
