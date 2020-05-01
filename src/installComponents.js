global.installComponents = function (c, l) {
  const t = typeof c.exports === 'function'
  const o = t ? c.exports.extendOptions : c.options

  o.components = (t ? c.exports.options.components : o.components) || {}

  for (var i in l) {
    o.components[i] = o.components[i] || l[i]
  }
}
