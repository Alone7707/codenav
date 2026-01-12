import type { Result } from '@/interfaces'
import { get, post } from './request'
import type {
  Category,
  Nav,
  ReqAddCategory,
  ReqAddOrEditNav,
  ReqBackground,
  ReqDelCategory,
  ReqId,
  ResBackground,
  SE,
} from '@/interfaces/api'
const publicPath = '/api/public'
const path = '/api'

// 搜索引擎列表
export const getSEList = () => {
  return get<SE[]>(`${publicPath}/search/list`, {})
}
// 导航列表
export const getNavList = () => {
  return get<Nav[]>(`${publicPath}/navigation/list`, {})
}
// 背景分类列表
export const getCatList = () => {
  return get<Category[]>(`${publicPath}/category/list`, {})
}
// 背景图片列表
export const getBgcList = (params: ReqBackground) => {
  return post<ResBackground>(`${publicPath}/background/list`, params)
}
// 添加(子)导航
export const addNav = (params: ReqAddOrEditNav) => {
  return post<Result>(`${path}/navigation/nav/addNav`, params)
}
// 编辑(子)导航
export const editNav = (params: ReqAddOrEditNav) => {
  return post<Result>(`${path}/navigation/nav/edit`, params)
}
// 删除(子)导航
export const delNav = (params: ReqId) => {
  return post<Result>(`${path}/navigation/nav/delete`, params)
}
// 获取(子)导航详情
export const getNavDetail = (params: ReqId) => {
  return post<Nav>(`${path}/navigation/nav/detail`, params)
}
// 新增背景分类
export const addCategory = (params: ReqAddCategory) => {
  return post<Result>(`${path}/navigation/background/addUserCategory`, params)
}
// 新增背景分类
export const delCategory = (params: ReqDelCategory) => {
  return post<Result>(`${path}/navigation/background/delUserCategory`, params)
}
