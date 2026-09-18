import { useMemo, useRef, useState } from 'react'
import { Switch } from '@mantine/core'
import { cleanText, detectNonAscii } from './unicode-map'
import { CharacterDetails } from './components/CharacterDetails'
import { Icon } from './components/Icon'
import { useClipboard } from './hooks/useClipboard'
import { useInputFocus } from './hooks/useInputFocus'
import { readPreferences, savePreferences, type Preferences } from './lib/preferences'

const EXAMPLE = '“Good writing” doesn’t need extra baggage.\n\nKeep your words — leave the clutter behind.\n\n• Smart quotes become simple quotes.\n• Long dashes become commas.\n• Invisible\u200B characters quietly disappear.'
const IS_APPLE = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
const PASTE_SHORTCUT = IS_APPLE ? '⌘ V' : 'Ctrl V'
const SWITCH_CLASSES = {
  root: 'setting-switch',
  body: 'setting-switch-body',
  labelWrapper: 'setting-switch-label-wrapper',
  label: 'setting-switch-label',
  description: 'setting-switch-description',
  track: 'setting-switch-track',
}

function App() {
  const [input, setInput] = useState('')
  const [preferences, setPreferences] = useState(readPreferences)
  const [pasteError, setPasteError] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLTextAreaElement>(null)
  const composing = useRef(false)
  const { status, copy, reset } = useClipboard()
  useInputFocus(inputRef)

  const detections = useMemo(() => detectNonAscii(input), [input])
  const cleaned = useMemo(() => cleanText(input, { replaceLongDashes: preferences.replaceLongDashes }), [input, preferences.replaceLongDashes])
  const inputStats = useMemo(() => ({
    characters: Array.from(input).length,
    words: input.trim().match(/\S+/g)?.length ?? 0,
  }), [input])
  const outputLength = useMemo(() => Array.from(cleaned).length, [cleaned])
  const hasInput = input.length > 0

  function updateInput(value: string) {
    setInput(value)
    setPasteError('')
    if (value.length > 0 && preferences.autoCopy && !composing.current) {
      copy(cleanText(value, preferences), true)
    } else {
      reset()
    }
  }

  function updatePreference(key: keyof Preferences, value: boolean) {
    const next = { ...preferences, [key]: value }
    setPreferences(next)
    savePreferences(next)
    if (input.length > 0 && next.autoCopy && !composing.current) {
      copy(cleanText(input, next), true)
    } else {
      reset()
    }
  }

  function prepareInput() {
    inputRef.current?.focus({ preventScroll: true })
    inputRef.current?.select()
  }

  async function pasteFromClipboard() {
    setPasteError('')
    try {
      if (!navigator.clipboard?.readText) throw new Error('Clipboard reading unavailable')
      const text = await navigator.clipboard.readText()
      if (!text) {
        setPasteError('No text on your clipboard. Copy some text, then paste here.')
        prepareInput()
        return
      }
      updateInput(text)
      inputRef.current?.focus({ preventScroll: true })
    } catch {
      setPasteError(`Clipboard access is blocked. Use ${PASTE_SHORTCUT}, or touch and hold the input to paste.`)
      prepareInput()
    }
  }

  function selectOutput() {
    outputRef.current?.focus({ preventScroll: true })
    outputRef.current?.select()
  }

  const copyMessage = status.state === 'copied'
    ? status.automatic ? 'Auto-copied to clipboard' : 'Copied to clipboard'
    : status.state === 'copying' ? 'Copying to clipboard…'
      : status.state === 'error' ? 'Not copied. Use Copy text to try again.'
        : null

  return (
    <div className="app-shell">
      <a className="skip-link" href="#text-input">Skip to text input</a>
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark"><Icon name="mark" size={23} /></span>
          <span>detect<span className="brand-suffix">gpt</span><span className="brand-period">.</span></span>
        </div>
      </header>

      <main id="main-content">
        <section className="intro" aria-labelledby="page-title">
          <h1 id="page-title">Your words.<br /><span>A little cleaner.</span></h1>
        </section>

        <section className="workspace" aria-label="Text cleaner">
        <div className="settings-bar" role="group" aria-label="Cleaning preferences">
          <Switch
            id="auto-copy" label="Auto-copy" description="Copy cleaned text automatically"
            aria-label="Auto-copy" checked={preferences.autoCopy} labelPosition="left"
            size="md" classNames={SWITCH_CLASSES} withThumbIndicator={false}
            onChange={(event) => updatePreference('autoCopy', event.currentTarget.checked)}
          />
          <Switch
            id="long-dashes" label="Long-dash replacer" description={<>Replace with {preferences.replaceLongDashes ? 'commas' : 'hyphens'}</>}
            aria-label="Long-dash replacer" checked={preferences.replaceLongDashes} labelPosition="left"
            size="md" classNames={SWITCH_CLASSES} withThumbIndicator={false}
            onChange={(event) => updatePreference('replaceLongDashes', event.currentTarget.checked)}
          />
        </div>

        <div className="editors">
          <section className="editor-pane input-pane" aria-labelledby="input-label">
            <div className="editor-toolbar">
              <label id="input-label" htmlFor="text-input" className="editor-label"><Icon name="text" size={17} />Your text</label>
              <div className="editor-actions">
                {hasInput && <button className="icon-button clear-button" type="button" aria-label="Clear text" title="Clear text"
                  onClick={() => { updateInput(''); inputRef.current?.focus({ preventScroll: true }) }}><Icon name="clear" size={16} /></button>}
                <button type="button" className="button button-paste" onClick={() => { void pasteFromClipboard() }}><Icon name="paste" size={15} />Paste text</button>
              </div>
            </div>
            <div className="text-area-wrap">
              <textarea
                ref={inputRef} id="text-input" className="editor-textarea input-textarea"
                placeholder="Paste text here"
                value={input} spellCheck={false} autoCapitalize="off" autoCorrect="off"
                aria-describedby={pasteError ? 'paste-error' : undefined}
                onChange={(event) => updateInput(event.currentTarget.value)}
                onPaste={(event) => {
                  // React skips onChange when an identical paste leaves the value unchanged.
                  // In that case the clipboard contains the original again, so explicitly copy.
                  const pasted = event.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n')
                  const field = event.currentTarget
                  const next = field.value.slice(0, field.selectionStart) + pasted + field.value.slice(field.selectionEnd)
                  if (pasted && next === input && preferences.autoCopy && !composing.current) {
                    copy(cleanText(next, preferences), true)
                  }
                }}
                onCompositionStart={() => { composing.current = true }}
                onCompositionEnd={(event) => { composing.current = false; updateInput(event.currentTarget.value) }}
              />
              {!hasInput && <div className="input-empty-actions">
                <span className="paste-key-hint"><kbd>{PASTE_SHORTCUT}</kbd> to paste</span>
                <button type="button" className="example-button" onClick={() => { updateInput(EXAMPLE); prepareInput() }}>Try an example<Icon name="arrow" size={14} /></button>
              </div>}
            </div>
            <div className="editor-footer">
              <span>{inputStats.words.toLocaleString()} {inputStats.words === 1 ? 'word' : 'words'}<span className="counter-divider">/</span>{inputStats.characters.toLocaleString()} <span className="character-unit">characters</span></span>
            </div>
          </section>

          <span className="transfer-mark" aria-hidden="true"><Icon name="arrow" size={17} /></span>

          <section className="editor-pane output-pane" aria-labelledby="output-label">
            <div className="editor-toolbar">
              <label id="output-label" htmlFor="text-output" className="editor-label"><Icon name="check" size={17} />Cleaned text</label>
              <button type="button" className={`button button-copy${status.state === 'copied' ? ' is-copied' : ''}`}
                aria-label="Copy cleaned text" disabled={!hasInput} onClick={() => copy(cleaned)}>
                <Icon name={status.state === 'copied' ? 'check' : 'copy'} size={15} />
                {status.state === 'copied' ? 'Copied' : 'Copy text'}
              </button>
            </div>
            <div className="text-area-wrap output-text-area-wrap">
              <textarea ref={outputRef} id="text-output" className={`editor-textarea output-textarea${!hasInput ? ' is-empty' : ''}`}
                readOnly value={cleaned} spellCheck={false}
                aria-describedby={status.state !== 'idle' ? 'copy-status' : undefined} />
              {!hasInput && <div className="output-empty-state" aria-hidden="true">
                <span>Cleaned text appears here</span>
              </div>}
              {hasInput && cleaned.length === 0 && <div className="output-empty-state output-removed-state">
                <Icon name="check" size={22} />
                <span>All detected characters were removed</span>
              </div>}
            </div>
            <div className="editor-footer output-footer">
              {status.state !== 'idle' && <span id="copy-status" className={`copy-status copy-status--${status.state}`} role="status" aria-live="polite" aria-atomic="true">
                  {status.state === 'copied' && <Icon name="check" size={14} />}
                  {status.state === 'error' && <Icon name="alert" size={14} />}
                  {copyMessage}
                </span>}
              {hasInput && <span className="output-count">{outputLength.toLocaleString()} characters</span>}
            </div>
          </section>
        </div>

        {(pasteError || status.state === 'error') && <div className="clipboard-help" role="alert">
          <Icon name="alert" size={17} />
          {pasteError ? <span id="paste-error">{pasteError}</span> : <span>Your browser blocked clipboard access. Try Copy text, or <button type="button" className="text-link" onClick={selectOutput}>select cleaned text</button> and copy it manually.</span>}
        </div>}

        <CharacterDetails detections={detections} options={preferences} hasInput={hasInput} />
        </section>
      </main>
    </div>
  )
}

export default App
