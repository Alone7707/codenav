/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * 验证url地址
 * @param url url地址
 * @returns 是否有效
 */
export const validateUrl = (url: string): boolean => {
  // 正则表达式匹配URL或本地地址localhost和ip格式
  const regex =
    /^(https?:\/\/)?(localhost|((\d{1,3}\.){3}\d{1,3})|([\da-z.-]+)\.([a-z.]{2,6}))(:\d{1,5})?([\/\w .-]*)*\/?$/i

  return regex.test(url)
}
