import Vue from 'vue'
<% const globalComponents = options.getComponents().filter(c => c.global && c.async) %>

const globalComponents = {
<%= globalComponents.map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `  ${c.pascalName.replace(/^Lazy/, '')}: () => import('../${relativeToBuild(c.filePath)}' /* webpackChunkName: "${c.chunkName}" */).then(c => ${exp})`
}).join(',\n') %>
}

for (const name in globalComponents) {
  Vue.component(name, globalComponents[name])
}
