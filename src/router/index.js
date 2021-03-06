import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/Login')
const Home = () => import('components/Home')
const Welcome = () => import('components/Welcome')
const UserList = () => import('components/user/UserList')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',

    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/userList', name: 'UserList', component: UserList },
    ]
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return;
  } else {
    const tokenStr = window.localStorage.getItem('token');
    tokenStr ? next() : next('/login');
  }

})


// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
