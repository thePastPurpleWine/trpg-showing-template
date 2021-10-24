import Vue from 'vue'
import VueRouter from 'vue-router'
const Index = () => import(/* webpackChunkName: "index" */ '../views/Index.vue')
const IndexIntermezzo = () => import(/* webpackChunkName: "index" */ '../views/IndexIntermezzo.vue')

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
  },
  {
    path: '/index-intermezzo',
    name: 'IndexIntermezzo',
    component: IndexIntermezzo,
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
