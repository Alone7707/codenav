import type { Result } from '@/interfaces'
import { post, get } from './request'
import type { EmailForm, LoginForm, ReqRefreshToken, ResLogin, UserInfo } from '@/interfaces/api'
const path = '/api/navigation'
const userPath = '/api/users'

// 登录
export const login = (params: LoginForm) => {
  return post<ResLogin>(`${path}/nav/login`, params)
}
// 注册
export const register = (params: LoginForm) => {
  return post<Result>(`${userPath}/register`, params)
}
// 刷新token
export const loginByRefreshToken = (params: ReqRefreshToken) => {
  return post<ResLogin>(`${userPath}/refreshToken`, params, { needAuth: false })
}
// 获取用户信息
export const getUserInfo = () => {
  return get<UserInfo>(`${userPath}/getUserInfo`)
}
// 获取用户信息
export const setBackground = (params: { id: number }) => {
  return post<UserInfo>(`${userPath}/setMyBgc`, params)
}
// 获取验证码
export const getCode = (params: EmailForm) => {
  return post<Result>(`/api/mail/send`, params)
}
