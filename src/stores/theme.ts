// stores/theme.ts
import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'
import { storage } from '@/utils/storage'
import type { Background } from '@/interfaces/api'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isInit: false,
    // 暗黑模式
    isDark: useDark(),
    _toggleDark: useToggle(useDark()) as () => void,
    bgcImg: '',
  }),

  actions: {
    // 暴露切换方法
    toggleDark() {
      this._toggleDark()
    },
    setBgcImg(url: string) {
      this.bgcImg = url
    },
    async getBgcImg() {
      // 添加 async 修饰符
      if (this.isInit) return
      try {
        // 添加异常捕获
        const img: Background | null = await storage.getItem('background') // 改为异步获取
        this.setBgcImg(
          img ? img.url : 'http://cdn.yeziji.xyz/img/background/%E6%AE%8B%E6%88%BF.jpg',
        )
      } catch (error) {
        console.error('背景图片加载失败:', error)
        this.setBgcImg('http://cdn.yeziji.xyz/img/background/%E6%AE%8B%E6%88%BF.jpg') // 添加备用图片
      } finally {
        this.isInit = true
      }
    },
  },

  getters: {
    // 如果需要可以通过 getter 暴露状态
    darkStatus: (state) => state.isDark,
  },
})
