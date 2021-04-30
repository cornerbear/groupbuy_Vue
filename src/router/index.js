import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    hidden: true
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    hidden: true
  }, {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    hidden: true,
    meta: {
      roles: ['admin', 'user']
    }
  }, {
    path: '/*',
    redirect: '/index'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router