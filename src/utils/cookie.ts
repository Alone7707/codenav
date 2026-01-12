export function setCookie(name: string, value: string, expire?: number) {
  let expires = ''
  if (expire) {
    const date = new Date()
    date.setTime(expire)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value}${expires}; path=/`
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim() // 去掉前导空格
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length) // 提取 Cookie 值
    }
  }
  return null // 如果找不到指定名称的 Cookie，返回 null
}

export function clearAllCookies() {
  const cookies = document.cookie.split(';')
  console.log(cookies)

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=' + new Date(0).toUTCString() + ';path=/'
  }
}
