import vueimage from './vueimage.vue'

function install(Vue) {
    if (install.installed) return
    install.installed = true
    Vue.component('SimpleAlert', vueimage)
  }
  
  const plugin = {
    install
  }
  
  let GlobalVue = null
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.vue
  }
  
  if (GlobalVue) {
    GlobalVue.use(plugin)
  }
  
  vueimage.install = install

  export default vueimage