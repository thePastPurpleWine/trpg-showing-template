import Vue from 'vue'
import VueRouter from 'vue-router'
const Index = () => import(/* webpackChunkName: "index" */ '../views/Index.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    meta: {
      title: '舞台',
      auth: false
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
