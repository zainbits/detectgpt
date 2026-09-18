import type { CSSProperties } from 'react'

const paths = {
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  check: 'm5 12 4 4L19 6',
  chevron: 'm6 9 6 6 6-6',
  clear: 'm6 6 12 12M18 6 6 18',
  copy: 'M9 9h11v11H9zM5 15H3V3h12v2',
  paste: 'M9 4H5v17h14V4h-4M9 2h6v5H9zM8 12h8M8 16h5',
  lock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
  return: 'M9 7 4 12l5 5M4 12h11a5 5 0 0 0 5-5V4',
  alert: 'M12 8v5m0 4h.01M10.3 3.8 1.8 18.5a1.7 1.7 0 0 0 1.5 2.5h17.4a1.7 1.7 0 0 0 1.5-2.5L13.7 3.8a2 2 0 0 0-3.4 0Z',
  text: 'M4 5h16M12 5v15M8 20h8',
  mark: 'M4 5h16M4 11h11M4 17h6m4 0 3 3 5-7',
} as const

export function Icon({ name, size = 18, className, style }: {
  name: keyof typeof paths
  size?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
