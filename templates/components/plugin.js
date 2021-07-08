import Vue from 'vue'
import * as components from './index'

for (const name in components) {
  Vue.component(name, components[name])
  const lazyName = 'Lazy' + name
  if (!lazyName in components) {
    Vue.component(lazyName, components[name])
  }
}
