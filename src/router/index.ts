import { createRouter, createWebHistory } from 'vue-router'
import AdminUsersVue from '@/views/Admin/Admin-Users/AdminUsers.vue'
import AdminArticlesVue from '@/views/Admin/Admin-Articles/AdminArticles.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home/Home.vue')
    },
    {
      path: '/goal',
      name: 'Goal',
      component: () => import('@/views/Goal/Goal.vue')
    },
    {
      path: '/write',
      name: 'Write',
      component: () => import('@/views/Write/Write.vue'),
      meta: { needAuth: true }
    },
    {
      path: '/articleDetail',
      name: 'ArticleDetail',
      component: () => import('@/views/Blog/Blog.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/Login.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      children: [
        {
          path: 'users',
          name: 'AdminUsers',
          component: AdminUsersVue
        },
        {
          path: 'articles',
          name: 'AdminArticles',
          component: AdminArticlesVue
        }
      ]
    }
  ],
  // 跳转路由后滚动条置顶
  scrollBehavior(to, from, saveScrollPosition) {
    return { left: 0, top: 0 }
  }
})

export default router
