import { createRouter, createWebHistory } from 'vue-router'

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
    },
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: () => import('../views/Home.vue'),
        hidden: true
      }, {
        path: '/userInfo',
        name: '个人中心',
        component: () => import('../views/About.vue'),
        hidden: true
      }
    ]
  }, {
    path: '/*',
    redirect: '/index'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
