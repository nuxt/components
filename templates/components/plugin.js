import Vue from 'vue'
import { wrapFunctional } from './utils'

<% const components = options.getComponents() %>

const components = {
<%= components.map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  const magicComments = [
    `webpackChunkName: "${c.chunkName}"`,
    c.prefetch === true || typeof c.prefetch === 'number' ? `webpackPrefetch: ${c.prefetch}` : false,
    c.preload === true || typeof c.preload === 'number' ? `webpackPreload: ${c.preload}` : false,
  ].filter(Boolean).join(', ')

  return `  '${c.pascalName.replace(/^Lazy/, '')}': () => import('../${relativeToBuild(c.filePath)}' /* ${magicComments} */).then(c => wrapFunctional(${exp}))`
}).join(',\n') %>
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
