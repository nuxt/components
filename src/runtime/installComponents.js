export default function installComponents (component, components) {
  const options = typeof component.exports === 'function'
    ? component.exports.extendOptions
    : component.options

  if (typeof component.exports === 'function') {
    options.components = component.exports.options.components
  }

  options.components = options.components || {}

  for (const i in components) {
    options.components[i] = options.components[i] || components[i]
  }
}
