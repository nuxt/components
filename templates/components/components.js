module.exports = function install(Vue) {
<%= options.getComponents().map(c => {
  let i = `require('${relativeToBuild(c.filePath)}').default`
  if (c.async) {
    i = `Promise.resolve(${i})`
  }
  return `  Vue.component('${c.pascalName}', ${i})`
}).join('\n') %>
}
