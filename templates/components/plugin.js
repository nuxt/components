import Vue from 'vue'
import { wrapFunctional } from './utils'

<% const components = options.getComponents() %>

const components = {
<%= components.map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  const magicComments = [
    `webpackChunkName: "${c.chunkName}"`,
    c.prefetch ? `webpackPrefetch: ${c.prefetch ? 'true' : 'false'}` : false,
    c.preload ? `webpackPreload: ${c.preload ? 'true' : 'false'}` : false,
  ].filter(Boolean).join(', ')

  return `  ${c.pascalName.replace(/^Lazy/, '')}: () => import('../${relativeToBuild(c.filePath)}' /* ${magicComments} */).then(c => wrapFunctional(${exp}))`
}).join(',\n') %>
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
