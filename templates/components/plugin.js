import Vue from 'vue'
import { wrapFunctional } from './utils'

<%
const rawComponents = options.getComponents()
const components = []
const svgs = []
for (const c of rawComponents) {
  if (c.svg) {
    svgs.push(c)
  } else {
    components.push(c)
  }
}
%>

const components = {
<%= components.map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `  ${
    c.pascalName.replace(/^Lazy/, '')
  }: () => import('../${
    relativeToBuild(c.filePath)
  }' /* webpackChunkName: "${
    c.chunkName
  }" */).then(c => wrapFunctional(${
    exp
  }))`
}).join(',\n') %>
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
