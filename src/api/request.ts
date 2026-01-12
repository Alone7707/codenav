import type { ResultData } from '@/interfaces'
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import useStore from '@/stores/index'

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean
  needAuth?: boolean
}

// 创建 axios 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // 你的 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const userStore = useStore()
    // 在发送请求之前做些什么
    // 例如，你可以在这里添加 token
    config.needAuth = config.needAuth ?? true
    if (config.needAuth && config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${userStore.token}`)
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    ElMessage.error('error')
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
    const { data } = response
    // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
    if (data.code && data.code !== 200) {
      ElMessage.error(data.message)
      return Promise.reject(data)
    }
    return data
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error)
  },
)

// 判断是否是完整 URL
function isFullUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

// 封装 GET 请求
export function get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
  const config = isFullUrl(url) ? { baseURL: '' } : {}
  return instance.get(url, { ...config, params, ..._object })
}

// 封装 POST 请求
export function post<T>(url: string, data?: object, _object = {}): Promise<ResultData<T>> {
  const config = isFullUrl(url) ? { baseURL: '' } : {}
  return instance.post(url, data, { ...config, ..._object })
}

// 封装 PUT 请求
export function put<T>(url: string, data?: object, _object = {}): Promise<ResultData<T>> {
  const config = isFullUrl(url) ? { baseURL: '' } : {}
  return instance.put(url, data, { ...config, ..._object })
}

// 封装 DELETE 请求
export function del<T>(url: string): Promise<ResultData<T>> {
  const config = isFullUrl(url) ? { baseURL: '' } : {}
  return instance.delete(url, config)
}

export default instance
