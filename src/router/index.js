import Vue from 'vue'
import VueRouter from "vue-router";
import login from '../views/login'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登陆界面',
    component: login
  },
  {
    path: '/home',
    name: '首页',
    component: () => import('../views/Home')
  }
]
const router = new VueRouter({
  mode: 'history',
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转来
  //next是一个函数，表示放行
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router