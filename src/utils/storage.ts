// src/utils/storage.ts

type StorageValue<T> = T | null

interface StorageOptions {
  namespace?: string // 命名空间（防止键名冲突）
}

class LocalStorageManager {
  private namespace: string

  constructor(options: StorageOptions = {}) {
    this.namespace = options.namespace || ''
  }

  /**
   * 获取带命名空间的完整键名
   */
  private getFullKey(key: string): string {
    return this.namespace ? `${this.namespace}:${key}` : key
  }

  /**
   * 存储数据（自动JSON序列化）
   */
  setItem<T>(key: string, value: T): void {
    try {
      const fullKey = this.getFullKey(key)
      const stringValue = JSON.stringify(value)
      localStorage.setItem(fullKey, stringValue)
    } catch (error) {
      console.error('LocalStorage setItem error:', error)
      // 可选：抛出错误或回调处理
    }
  }

  /**
   * 获取数据（自动JSON解析 + 过期检查）
   */
  getItem<T>(key: string): StorageValue<T> {
    try {
      const fullKey = this.getFullKey(key)
      const value = localStorage.getItem(fullKey)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('LocalStorage getItem error:', error)
      return null
    }
  }

  /**
   * 删除数据（同时删除过期时间标记）
   */
  removeItem(key: string): void {
    const fullKey = this.getFullKey(key)
    localStorage.removeItem(fullKey)
  }

  /**
   * 清空当前命名空间下的所有数据
   */
  clear(): void {
    if (!this.namespace) {
      localStorage.clear()
      return
    }

    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${this.namespace}:`))
      .forEach((key) => {
        localStorage.removeItem(key)
      })
  }
}

// 默认导出实例（可根据需要创建多个实例）
export const storage = new LocalStorageManager({
  namespace: 'nav', // 全局命名空间
})
