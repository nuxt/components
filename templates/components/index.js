<%= options.getComponents().filter(c => !c.async).map(c => {
  const exp = c.pascalName === c.export ? c.pascalName : `${c.export} as ${c.pascalName}`
  return `export { ${exp} } from '../${relativeToBuild(c.filePath)}'`
}).join('\n') %>

<%= options.getComponents().filter(c => c.async).map(c => {
  const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
  return `export const ${c.pascalName} = import('../${relativeToBuild(c.filePath)}' /* webpackChunkName: "${c.chunkName}" */).then(c => ${exp})`
}).join('\n') %>
