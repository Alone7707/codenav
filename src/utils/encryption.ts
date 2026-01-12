import md5 from 'md5'

export function encryptionPwd(pwd?: string) {
  // 执行函数逻辑
  if (pwd) {
    const firstMd5 = md5(pwd).toLowerCase().slice(8, 24)
    const secondMd5 = md5(firstMd5).toLowerCase().slice(8, 24)
    return secondMd5
  } else {
    return ''
  }
}
