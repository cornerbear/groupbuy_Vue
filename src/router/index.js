import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: '管理员主页面',
    component: () => import('../views/admin/Index.vue'),
    children: [
      {
        path: 'menu1',
        name: '页面1',
        component: () => import('../views/PageOne'),
      },
      {
        path: '/pageTwo',
        name: '页面2',
        component: () => import('../views/PageTwo')
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
    component: () => import('../views/Test.vue'),
    children: [
      {
        path: '/pageThree',
        name: '页面3',
        component: () => import('../views/PageThree')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
