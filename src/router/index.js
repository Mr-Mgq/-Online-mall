import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ProductDetail from '../views/product/ProductDetail.vue'
import Cart from '../views/product/Cart.vue'
import OrderDetail from '@/views/product/OrderDetail.vue' // ⬅️ 新增导入
import { useUserStore } from '../stores/user.js'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }  // 购物车页面需要登录
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue') // 异步加载搜索页面
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/product/Orders.vue')
  },
  {
    path: '/orders/:id', // ⬅️ 新增订单详情路由
    name: 'OrderDetail',
    component: OrderDetail,
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('@/views/UserProfile.vue'), // 用户个人中心
    meta: { requiresAuth: true }  // 如果你有登录守卫
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫，判断访问需要登录的页面时是否已登录
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.userInfo) {
    next({ name: 'Login', query: { redirect: to.fullPath } }) // 未登录跳登录页，登录后可重定向回来
  } else {
    next()
  }
})

export default router
