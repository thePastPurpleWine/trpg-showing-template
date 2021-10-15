import Vue from 'vue'
import App from './App.vue'
import router from './router'

import _ from 'lodash'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import moment from 'moment'
import 'moment/locale/zh-cn'

import VueCropper from 'vue-cropper'

moment.locale('zh-cn')

Vue.config.productionTip = false

Vue.use(VueCropper)

Vue.use(Antd)

Vue.prototype._ = _
Vue.prototype.moment = moment

router.beforeEach((to, from, next) => {
  if (to.redirectedFrom === '/') {
    window.location.href = '/index'
  } else {
    NProgress.start()
    document.title = to.meta.title
    next()
  }
})
router.afterEach(() => {
  NProgress.done()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
