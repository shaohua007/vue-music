/*
 * @Author: your name
 * @Date: 2019-12-30 16:40:58
 * @LastEditTime : 2020-01-13 19:52:18
 * @LastEditors  : 少华
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload'

import './assets/stylus/index.styl'

fastclick.attach(document.body);

Vue.use(VuelazyLoad, {
  loading: require('./assets/image/loading.gif')
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
