import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

import * as filters from './filters' // global filters

import './directive/el-select/loadmore'

import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'

import { VueEditor } from 'vue2-editor'

import VueClipboard from 'vue-clipboard2'

import AmapVueConfig from '@amap/amap-vue/lib/config'
AmapVueConfig.key = 'afbdd1f06ba211d9179a51362bc4a935'

Vue.use(FormMaking)

Vue.use(VueEditor)

Vue.use(VueClipboard)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // i18n,
  render: h => h(App)
})
