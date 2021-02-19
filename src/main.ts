import '@/plugins/vueBootstrap'
import '@/sass/global.sass'

import App from './App.vue'
import Vue from 'vue'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')
