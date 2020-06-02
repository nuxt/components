import Vue from 'vue'
<% const globalComponents = options.getComponents().filter(c => c.global && c.async) %>

<%= globalComponents.map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `const ${c.pascalName.replace(/^Lazy/, '')} = import('../${relativeToBuild(c.filePath)}' /* webpackChunkName: "${c.chunkName}" */).then(c => ${exp})`
}).join('\n') %>


const globalComponents = { <%= globalComponents.map(c => c.pascalName.replace(/^Lazy/, '')).join(', ') %> }

export function install(Vue) {
  for (const name in globalComponents) {
    Vue.component(name, globalComponents[name])
  }
}

Vue.use(install)
