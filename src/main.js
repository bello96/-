import Vue from 'vue'
import App from './App'
import router from './router'

// 1.导入Element-UI 组件库
import ElementUI from 'element-ui'

// 导入公共样式
import '@/assets/common.css'

// 2.导入Element-UI 样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入树状插件element
import ElTreeGrid from 'element-tree-grid'

// 导入quill富文本
import VueQuillEditor from 'vue-quill-editor'
// 导入相关的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入moment函数
import moment from 'moment'

// 优化axios(每次都要引入很麻烦,可以在main中将axios绑定到vue的原型上,需要用到直接用this即可)
import axios from 'axios'
Vue.prototype.axios = axios

// 注册富文本编辑器插件
Vue.use(VueQuillEditor)
// 注册一个全局的组件
Vue.component('el-table-tree-column', ElTreeGrid)

// 定义一个全局过滤器
Vue.filter('dataFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

// 优化请求地址(定义全局的url)
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 优化请求头
// 请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么(设置token)
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    // 优化每次都要多.data   这样是直接返回response.data
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 3.使用element-UI这个插件
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
