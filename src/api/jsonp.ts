function jsonp<T>(url: string, callbackName: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${url}&callback=${callbackName}`
    document.body.appendChild(script)
    interface Window {
      [key: string]: (data: T) => void
    }

    ;(window as unknown as Window)[callbackName] = (data: T) => {
      resolve(data)
      cleanup()
    }
    script.onerror = () => {
      reject(new Error('JSONP request failed'))
      cleanup()
    }

    function cleanup() {
      document.body.removeChild(script)
      delete (window as unknown as Window)[callbackName]
    }
  })
}

export default jsonp
