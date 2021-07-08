import { wrapFunctional } from './utils'

<%= options.getComponents().map(c => {
  const magicComments = [
    `webpackChunkName: "${c.chunkName}"`,
    c.prefetch === true || typeof c.prefetch === 'number' ? `webpackPrefetch: ${c.prefetch}` : false,
    c.preload === true || typeof c.preload === 'number' ? `webpackPreload: ${c.preload}` : false,
  ].filter(Boolean).join(', ')
  if (c.isLazy || !nuxtOptions.dev) {
    const exp = c.export === 'default' ? `c.default || c` : `c['${c.export}']`
    const lazyImport = `import('../${relativeToBuild(c.filePath)}' /* ${magicComments} */).then(c => wrapFunctional(${exp}))`
    return `export const ${c.pascalName} = ${lazyImport}`
  } else {
    const exp = c.export === 'default' ? `default as ${c.pascalName}` : c.pascalName
    return `export { ${exp} } from '../${relativeToBuild(c.filePath)}'`
  }
}).join('\n') %>
