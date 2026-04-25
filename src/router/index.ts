import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import AdminCenter from '../views/AdminCenter.vue'
import UserCenter from '../views/UserCenter.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  {
    path: '/admin',
    component: AdminCenter,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/user',
    component: UserCenter,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const userInfo = localStorage.getItem('user')
  const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null

  if (to.meta.requiresAuth) {
    if (!parsedUserInfo) {
      next('/login')
    } else {
      if (to.meta.role) {
        if (parsedUserInfo.role === to.meta.role) {
          next()
        } else {
          next('/user')
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router