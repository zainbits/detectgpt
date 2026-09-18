import { useEffect, type RefObject } from 'react'

/** Refocus on genuine page/window returns, never on edits or in-page control changes. */
export function useInputFocus(inputRef: RefObject<HTMLTextAreaElement | null>) {
  useEffect(() => {
    let frame = 0
    const prepareForPaste = () => {
      cancelAnimationFrame(frame)
      if (document.visibilityState !== 'visible') return
      frame = requestAnimationFrame(() => {
        if (document.visibilityState !== 'visible') return
        const input = inputRef.current
        if (!input) return
        input.focus({ preventScroll: true })
        input.select()
      })
    }

    prepareForPaste()
    window.addEventListener('focus', prepareForPaste)
    window.addEventListener('pageshow', prepareForPaste)
    document.addEventListener('visibilitychange', prepareForPaste)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('focus', prepareForPaste)
      window.removeEventListener('pageshow', prepareForPaste)
      document.removeEventListener('visibilitychange', prepareForPaste)
    }
  }, [inputRef])
}
