import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/components/goods/Goods'
import Ratings from '@/components/ratings/Ratings'
import Sellers from '@/components/sellers/Sellers'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/goods' },
    { path: '/goods', component: Goods },
    { path: '/ratings', component: Ratings },
    { path: '/sellers', component: Sellers }
  ]
})
