import { createRouter, createWebHistory } from 'vue-router'

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
    }
  ]
})

export default router
