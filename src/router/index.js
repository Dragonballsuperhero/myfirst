import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Wecome from '@/views/Wecome.vue'
import Users from '@/views/Users/Users.vue'
import Rights from '@/views/power/Rights.vue'
import Roles from '@/views/power/Roles.vue'
import Cate from '@/views/goods/Cate.vue'

Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home,redirect:'/wecome' ,children:[
      {path:'/wecome',component:Wecome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate}
    ]}
  ]
})
// 路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login')next();
    const token =  sessionStorage.getItem('token');
    if(!token)next('/login')
    next();
})

export default router
