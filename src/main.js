import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import notification from './assets/js/notification'
import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.notification = notification; //将notification挂载到原型对象里
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http  = axios;

Vue.component('tree-table',TreeTable);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
