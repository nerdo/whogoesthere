import { useEffect } from 'react'

export const useOnPageLeave = (handler: () => any) => {
  useEffect(() => {
    window.onbeforeunload = () => handler()

    window.addEventListener('beforeunload', (event) => {
      handler()
    })

    return () => {
      handler()
      document.removeEventListener('beforeunload', handler)
    }
  })
}
