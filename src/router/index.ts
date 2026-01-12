import { createRouter, createWebHistory } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import useStore from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      meta: {
        title: '首页',
        KeepAlive: true,
      },
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/navConfig',
      name: 'navConfig',
      meta: {
        title: '导航配置',
      },
      component: () => import('@/views/NavConfigView.vue'),
    },
    {
      path: '/bgcConfig',
      name: 'bgcConfig',
      meta: {
        title: '背景设置',
      },
      component: () => import('@/views/BgcConfigView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const themeStore = useThemeStore()
  const store = useStore()
  // 初始化背景图片
  await store.init()
  themeStore.getBgcImg()
  next()
})

export default router
