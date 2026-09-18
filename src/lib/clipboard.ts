/** Legacy fallback for browsers without the Clipboard API. Keep the editor selection intact. */
function legacyCopy(text: string): void {
  const activeElement = document.activeElement
  const field = activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement
    ? activeElement
    : null
  const selection = field
    ? { start: field.selectionStart, end: field.selectionEnd, direction: field.selectionDirection }
    : null
  const scroll = { x: window.scrollX, y: window.scrollY }
  const buffer = document.createElement('textarea')
  buffer.value = text
  buffer.setAttribute('readonly', '')
  buffer.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;font-size:16px'
  document.body.append(buffer)

  try {
    buffer.focus({ preventScroll: true })
    buffer.select()
    if (!document.execCommand('copy')) throw new Error('Clipboard access is unavailable')
  } finally {
    buffer.remove()
    if (activeElement instanceof HTMLElement) activeElement.focus({ preventScroll: true })
    if (field && selection && selection.start !== null && selection.end !== null) {
      field.setSelectionRange(selection.start, selection.end, selection.direction ?? 'none')
    }
    window.scrollTo(scroll.x, scroll.y)
  }
}

/** Call directly from a user event, not an effect or debounce, to retain clipboard activation. */
export function writeClipboardText(text: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
    legacyCopy(text)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
