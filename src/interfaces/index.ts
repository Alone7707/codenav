export interface Result {
  code: string | number
  msg: string
}
export interface ResultData<T = unknown> extends Result {
  [x: string]: unknown // 富文本编辑器 使用到的上传图会显示 key 值 不存在
  data: T
}
export interface ResultRecords<T> {
  total: number
  pageNum: number
  pageSize: number
  record: T
}
