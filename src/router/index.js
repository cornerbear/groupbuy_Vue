import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
      path: '/',
      name: 'Login',
      component: () => import('../views/Login'),
      hidden: true
  },
  {
    path: '/',
    name: '管理员主页面',
    component: () => import('../views/background/Index'),
    children: [
      {
        path: 'goods',
        name: '商品管理',
        component: () => import('../views/background/Goods'),
      },
      {
        path: 'category',
        name: '类别管理',
        component: () => import('../views/background/Category'),
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/background/Test.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
