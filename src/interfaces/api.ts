export interface Nav {
  id: number
  name: string
  url: string
  icon: string | null
  parent_id: number | undefined
  children?: NavChild[]
}
export interface NavChild {
  id: number
  name: string
  url: string
  icon: null
  parent_id: number
}
export interface SE {
  id: number
  label: string
  path: string
  search_path: string
  logo: string
}

export interface LoginForm {
  username: string
  password: string
}
export interface RegisterForm {
  username: string
  password: string
  email: string
  code: string
}

export interface ResLogin {
  accessToken: string
  token_expiresIn: number
  refreshToken: string
  refresh_token_valid_time: number
}

export interface ReqRefreshToken {
  refreshToken: string
}

export interface UserInfo {
  id: number
  username: string
  avatar: string
  email: string
  status: number
  role_name: string
  background: string
  create_time: number
}

export interface Category {
  id: number
  name: string
  custom: boolean
}

export interface ReqBackground {
  type: number
  pageNum: number
  pageSize: number
}
export interface ReqId {
  id: number
}

export interface Background {
  id: number
  name: string
  type: string
  url: string
  create_time: number
}

export interface ResBackground {
  record: Background[]
  total: number
  pageNum: number
  pageSize: number
}

export interface ReqAddOrEditNav {
  id?: number
  name: string
  url: string
  icon?: string
  parentId?: number
}

export interface EmailForm {
  email: string
  type: 1 | 2 // 1: 注册 2: 找回密码
}

export interface ReqAddCategory {
  name: string
}
export interface ReqDelCategory {
  id: number
}
