import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill'
import router from './router'
import ElementUI from './config/elementConfig.js'
import VueClipboard from 'vue-clipboard2'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  InfiniteScroll
} from 'mint-ui'
import './config/mint-variables.css'
require('es6-promise').polyfill()
require('isomorphic-fetch')
import './assets/css/base.css'
import filters from './assets/js/filters'
import store, {
  defaultNodeAddress
} from './store'
import '@/assets/js/flexible.js'
import '@/assets/js/flexible_css.js'
import '@/assets/css/app.scss'
import Chain33Rpc from 'chain33-rpc-api'

// Vue.use(VueI18n)
Vue.use(InfiniteScroll)
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) //注册全局filter；
})

// 注册 查询区块链的接口
Vue.prototype.$chain33Rpc = new Chain33Rpc(defaultNodeAddress, null, (error) => {
  if (error.message === 'Failed to fetch') {
    store.commit('connectStatusOff')
  }
  throw error
})

// 处理index含有参数的跳转
router.beforeEach(function (to, from, next) {
  NProgress.start();
  if (to.name === 'indexPage') {
    if (to.query.address) {
      next({
        path: '/addressDetail',
        replace: true,
        query: to.query
      })
    } else if (to.query.height) {
      next({
        path: '/blockDetail',
        replace: true,
        query: to.query
      })
    } else if (to.query.hash) {
      next({
        path: '/tradeHash',
        replace: true,
        query: to.query
      })
    } else {
      next()
    }
  } else {
    next()
  }
})


router.afterEach(() => {
  NProgress.done();
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')