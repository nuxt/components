import { wrapFunctional } from './utils'

<%= options.getComponents().map(c => {
  const exp = c.pascalName === c.export ? c.pascalName : `${c.export} as ${c.pascalName}`
  return `export { ${exp} } from '../${relativeToBuild(c.filePath)}'`
}).join('\n') %>

<%= options.getComponents().map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  const magicComments = [
    `webpackChunkName: "${c.chunkName}"`,
    c.prefetch === true || typeof c.prefetch === 'number' ? `webpackPrefetch: ${c.prefetch}` : false,
    c.preload === true || typeof c.preload === 'number' ? `webpackPreload: ${c.preload}` : false,
  ].filter(Boolean).join(', ')

  return `export const Lazy${c.pascalName} = import('../${relativeToBuild(c.filePath)}' /* ${magicComments} */).then(c => wrapFunctional(${exp}))`
}).join('\n') %>
