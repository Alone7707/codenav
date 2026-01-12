//定义关于counter的store
import { getUserInfo, loginByRefreshToken } from '@/api/login'
import type { ResLogin } from '@/interfaces/api'
import { clearAllCookies, getCookie, setCookie } from '@/utils/cookie'
import { storage } from '@/utils/storage'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useThemeStore } from './theme'
interface UserInfo {
  id?: number
  username?: string
  avatar?: string
  email?: string
  status?: number
  role_name?: string
  create_time?: number
  background?: string
}

const useStore = defineStore('main', {
  state: (): { isInit: boolean; userInfo: UserInfo; token: string; keepAliveList: string[] } => {
    return {
      isInit: false, // 是否已初始化用户信息
      userInfo: {}, // 当前登录用户信息
      token: '',
      keepAliveList: [], // 需要keepAlive的页面name
    }
  },

  getters: {
    getUserInfo: (state) => state.userInfo,
  },

  actions: {
    // 获取需要keepAlive的组件
    getKeepAlive() {
      const router = useRouter()
      const routers = router.getRoutes()
      const temp: string[] = []
      routers.forEach((item) => {
        if (item.meta.KeepAlive) {
          temp.push(item.name as string)
        }
      })
      console.log(temp)
      this.keepAliveList = temp
    },
    // 判定是否登录状态，是则获取用户信息，否则直接return
    async init() {
      if (this.isInit) return
      try {
        await this.checkToken()
        if (this.token) {
          await this.setUserInfo()
        }
        this.isInit = true
      } catch (error) {
        this.resetToken() // 添加错误处理
        this.isInit = false
        throw error
      }
    },
    getToken() {
      const accessToken = getCookie('accessToken')
      if (accessToken) {
        this.token = accessToken
      }
    },
    async setToken(data: ResLogin) {
      this.token = data.accessToken
      setCookie('accessToken', data.accessToken, data.token_expiresIn)
      setCookie('refreshToken', data.refreshToken, data.refresh_token_valid_time)
      await this.setUserInfo()
    },
    async checkToken() {
      const accessToken = getCookie('accessToken')
      if (!accessToken) {
        const refreshToken = getCookie('refreshToken')
        if (refreshToken) {
          await new Promise((resolve) => {
            loginByRefreshToken({ refreshToken })
              .then(async (res) => {
                const { code, data } = res
                if (code === 200) {
                  await this.setToken(data)
                }
                resolve(true)
              })
              .catch(() => {
                this.resetToken()
                resolve(false)
              })
          })
        } else {
          this.resetToken()
        }
      } else {
        this.token = accessToken
      }
    },
    resetToken() {
      const themeStore = useThemeStore()
      this.token = ''
      this.userInfo = {}
      storage.removeItem('userInfo')
      storage.removeItem('background')
      themeStore.isInit = false
      themeStore.getBgcImg()
      clearAllCookies()
    },
    async setUserInfo() {
      return new Promise(async (resolve) => {
        const themeStore = useThemeStore()
        const { code, data } = await getUserInfo()
        if (code === 200) {
          this.userInfo = data
          storage.setItem('userInfo', data)
          themeStore.setBgcImg(data.background)
          storage.setItem('userInfo', data.background)
        }
        resolve(true)
      })
    },
  },
})

//暴露这个useStore模块
export default useStore

/*
  调用pinia中的变量
  import useStore from '@/store/index'
  const store = useStore()
  console.log(store.count)
 */
