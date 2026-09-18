import { useMemo } from 'react'
import { CATEGORY_INFO, getReplacement, type Detection, type CleanOptions } from '../unicode-map'
import { Icon } from './Icon'

export function CharacterDetails({ detections, options, hasInput }: {
  detections: Detection[]
  options: CleanOptions
  hasInput: boolean
}) {
  const groups = useMemo(() => {
    const grouped = new Map<string, Detection & { count: number }>()
    for (const detection of detections) {
      const existing = grouped.get(detection.entry.codePoint)
      if (existing) existing.count += 1
      else grouped.set(detection.entry.codePoint, { ...detection, count: 1 })
    }
    return [...grouped.values()]
  }, [detections])

  if (detections.length === 0) {
    return (
      <div className="change-summary change-summary--quiet" aria-live="polite">
        <span className="summary-icon"><Icon name={hasInput ? 'check' : 'text'} size={17} /></span>
        <span>{hasInput ? 'Nothing to clean. Your text is ready to go.' : 'Small fixes, without rewriting your words.'}</span>
        <span className="summary-aside">{hasInput ? 'No matching characters' : 'Quotes, dashes, spaces & more'}</span>
      </div>
    )
  }

  return (
    <details className="change-details">
      <summary className="change-summary">
        <span className="summary-icon"><Icon name="check" size={17} /></span>
        <span className="summary-title">{detections.length.toLocaleString()} character{detections.length === 1 ? '' : 's'} cleaned</span>
        <span className="summary-aside">View changes</span>
        <Icon name="chevron" size={16} className="details-chevron" />
      </summary>
      <div className="character-list">
        <div className="character-list-heading" aria-hidden="true">
          <span>Character</span><span>Replacement</span><span>Count</span>
        </div>
        <ul aria-label="Character replacements">
          {groups.map(({ entry, char, count }) => {
            const replacement = getReplacement(entry, options)
            const invisible = entry.category === 'invisible' || entry.category === 'spaces' || char === '\u00AD'
            return (
              <li className="character-row" key={entry.codePoint}>
                <div className="character-info">
                  <span className={`character-glyph${invisible ? ' character-glyph--invisible' : ''}`} aria-hidden="true">
                    {invisible ? '·' : char}
                  </span>
                  <span className="character-description">
                    <span className="character-name">{entry.name}</span>
                    <span className="character-meta"><code>{entry.codePoint}</code><span>{CATEGORY_INFO[entry.category].label}</span></span>
                  </span>
                </div>
                <span className="character-replacement">
                  <Icon name="arrow" size={14} />
                  {replacement === '' ? <span className="replacement-label">Removed</span>
                    : replacement === ' ' ? <span className="replacement-label">Space</span>
                      : <code>{replacement}</code>}
                </span>
                <span className="character-count"><span className="sr-only">Occurrences: </span>{count.toLocaleString()}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </details>
  )
}
