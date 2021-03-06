import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './common/less/index.less'
// 引入并注册vue-photo-preview，功能：实现点击图片缩略图列表展示预览图的效果
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

// 全局注册axios，不能使用Vue.use(axios)，需要在Vue的原型中引入
Vue.prototype.axios = axios
axios.defaults.baseURL = 'https://www.easy-mock.com/mock/5cbd1744d5d9f6662f086211/ele'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
