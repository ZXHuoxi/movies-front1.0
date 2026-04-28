import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import AdminCenter from '../views/AdminCenter.vue'
import UserCenter from '../views/UserCenter.vue'
import HomePage from '../views/HomePage.vue'
import DocumentationPage from '../views/DocumentationPage.vue'

/**
 * 路由配置
 */
const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage }, // 首页
  { path: '/login', component: LoginPage }, // 登录页
  { path: '/admin', component: AdminCenter, meta: { requiresAuth: true, role: 'admin' } }, // 管理员中心，需要管理员权限
  { path: '/user', component: UserCenter, meta: { requiresAuth: true } }, // 用户中心，需要登录
  { path: '/documentation', component: DocumentationPage } // 文档页
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 路由守卫
 * 处理权限验证
 */
router.beforeEach((to, _from, next) => {
  const userInfo = localStorage.getItem('user')
  const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null

  if (to.meta.requiresAuth) {
    // 需要登录的路由
    if (!parsedUserInfo) {
      // 未登录，跳转到登录页
      next('/login')
    } else {
      if (to.meta.role) {
        // 需要特定角色的路由
        if (parsedUserInfo.role === to.meta.role) {
          // 角色匹配，允许访问
          next()
        } else {
          // 角色不匹配，跳转到用户中心
          next('/user')
        }
      } else {
        // 只需要登录，不需要特定角色
        next()
      }
    }
  } else {
    // 不需要登录的路由
    next()
  }
})

export default router