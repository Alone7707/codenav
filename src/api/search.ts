import { get } from './request'
const path = '/api'

// 搜索引擎列表
export const getKeyword = (value: string) => {
  const _value = decodeURIComponent(value)
  return get<string[]>(`${path}/search?keyword=${_value}`, {})
}
