import { createApp, h, ref } from 'vue'
import ToastComponent from './ToastIndex.vue' // 导入你的 Toast 组件

interface ToastOptions {
  message: string
  type: 'success' | 'error'
  duration?: number
}

const createToast = (options: ToastOptions) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  let toastInstance: unknown

  const toastApp = createApp({
    setup() {
      const toastRef = ref()

      const show = () => {
        toastRef.value?.show()
      }

      const destroy = () => {
        toastApp.unmount()
        document.body.removeChild(container)
      }

      toastInstance = { show, destroy }

      return () =>
        h(ToastComponent, {
          ref: toastRef,
          message: options.message,
          duration: options.duration,
          type: options.type,
          onClose: destroy,
        })
    },
  })

  toastApp.mount(container)

  return toastInstance
}

const Toast = {
  show(options: ToastOptions) {
    return createToast(options)
  },
}

export default Toast
