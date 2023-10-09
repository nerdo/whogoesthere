// A modified version of someone else's code that takes into account cleanup.
// Reference: https://taig.medium.com/prevent-react-from-triggering-useeffect-twice-307a475714d7
import type { EffectCallback } from 'react'
import { useEffect, useRef } from 'react'

export function useInitializer(effect: EffectCallback) {
  const initialized = useRef(false)
  let realCleanup: ReturnType<EffectCallback> | undefined

  const cleanup = () => {
    if (realCleanup) {
      realCleanup()
    }
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      realCleanup = effect()
    }
    return cleanup
  }, [])
}
