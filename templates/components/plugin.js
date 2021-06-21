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
  const magicComments = [
    `webpackChunkName: "${c.chunkName}"`,
    c.prefetch === true || typeof c.prefetch === 'number' ? `webpackPrefetch: ${c.prefetch}` : false,
    c.preload === true || typeof c.preload === 'number' ? `webpackPreload: ${c.preload}` : false,
  ].filter(Boolean).join(', ')

  return `  ${c.pascalName.replace(/^Lazy/, '')}: () => import('../${relativeToBuild(c.filePath)}' /* ${magicComments} */).then(c => wrapFunctional(${exp}))`
}).join(',\n') %>
}

const svgs = {}

<% for (const c of svgs) { %>
svgs[`<%= c.pascalName %>`] = {
  render (h) {
    const src = require('../<%= relativeToBuild(c.filePath) %>' /* webpackChunkName: "<%= c.chunkName %>" */)
    return h('img', { attrs: { src } })
  }
}
<% } %>

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}

for (const name in svgs) {
  Vue.component(name, svgs[name])
}
