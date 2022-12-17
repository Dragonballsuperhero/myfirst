import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import notification from './assets/js/notification'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' 
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.prototype.notification = notification; //将notification挂载到原型对象里
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config=>{
    NProgress.start();
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
})
axios.interceptors.response.use(config=>{
  NProgress.done();
  return config;
})

Vue.use(VueQuillEditor)

Vue.prototype.$http  = axios;

Vue.component('tree-table',TreeTable);

Vue.filter('formatDate',function(date){
     const dt =  new Date(date);
     let yy = (dt.getFullYear()+'').padStart(2,'0');
     let mm = (dt.getMonth() +1+'').padStart(2,'0');
     let dd = (dt.getDate()+'').padStart(2,'0');

     let h = (dt.getHours()+'').padStart(2,'0');
     let m = (dt.getMinutes()+'').padStart(2,'0');
     let s = (dt.getSeconds()+'').padStart(2,'0');
    return `${yy}-${mm}-${dd} ${h}:${m}:${s}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
