import Vue from 'vue'
<% const components = options.getComponents() %>

const components = {
<%= components.map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `  ${c.pascalName.replace(/^Lazy/, '')}: () => import('../${relativeToBuild(c.filePath)}' /* webpackChunkName: "${c.chunkName}" */).then(c => ${exp})`
}).join(',\n') %>
}

for (const name in components) {
  Vue.component(name, components[name])
}
