import { useCallback, useEffect, useRef, useState } from 'react'
import { writeClipboardText } from '../lib/clipboard'

export type CopyStatus =
  | { state: 'idle' }
  | { state: 'copying' | 'copied' | 'error'; automatic: boolean }

export function useClipboard() {
  const [status, setStatus] = useState<CopyStatus>({ state: 'idle' })
  const revision = useRef(0)

  const reset = useCallback(() => {
    revision.current += 1
    setStatus({ state: 'idle' })
  }, [])

  const copy = useCallback((text: string, automatic = false) => {
    const request = ++revision.current
    // Begin the actual write in the paste/edit/click handler, before any async work.
    const pending = writeClipboardText(text)
    setStatus({ state: 'copying', automatic })
    void pending.then(
      () => {
        if (revision.current === request) setStatus({ state: 'copied', automatic })
      },
      () => {
        if (revision.current === request) setStatus({ state: 'error', automatic })
      },
    )
  }, [])

  useEffect(() => () => { revision.current += 1 }, [])

  return { status, copy, reset }
}
