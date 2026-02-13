/**
 * Map of non-ASCII Unicode characters commonly inserted by ChatGPT / AI models,
 * along with their safe ASCII replacements.
 *
 * Each entry includes:
 *  - char: the problematic Unicode character
 *  - name: human-readable name
 *  - codePoint: the U+XXXX identifier
 *  - replacement: the ASCII equivalent
 *  - category: grouping for display purposes
 */

export interface UnicodeEntry {
  char: string
  name: string
  codePoint: string
  replacement: string
  category: 'quotes' | 'dashes' | 'spaces' | 'punctuation' | 'invisible'
}

export const UNICODE_MAP: UnicodeEntry[] = [
  // ── Smart / Curly Quotes ──────────────────────────────────
  { char: '\u201C', name: 'Left Double Quotation Mark', codePoint: 'U+201C', replacement: '"', category: 'quotes' },
  { char: '\u201D', name: 'Right Double Quotation Mark', codePoint: 'U+201D', replacement: '"', category: 'quotes' },
  { char: '\u2018', name: 'Left Single Quotation Mark', codePoint: 'U+2018', replacement: "'", category: 'quotes' },
  { char: '\u2019', name: 'Right Single Quotation Mark / Apostrophe', codePoint: 'U+2019', replacement: "'", category: 'quotes' },
  { char: '\u201A', name: 'Single Low-9 Quotation Mark', codePoint: 'U+201A', replacement: "'", category: 'quotes' },
  { char: '\u201E', name: 'Double Low-9 Quotation Mark', codePoint: 'U+201E', replacement: '"', category: 'quotes' },
  { char: '\u2039', name: 'Single Left-Pointing Angle Quotation', codePoint: 'U+2039', replacement: '<', category: 'quotes' },
  { char: '\u203A', name: 'Single Right-Pointing Angle Quotation', codePoint: 'U+203A', replacement: '>', category: 'quotes' },
  { char: '\u00AB', name: 'Left-Pointing Double Angle Quotation', codePoint: 'U+00AB', replacement: '<<', category: 'quotes' },
  { char: '\u00BB', name: 'Right-Pointing Double Angle Quotation', codePoint: 'U+00BB', replacement: '>>', category: 'quotes' },

  // ── Dashes ────────────────────────────────────────────────
  { char: '\u2014', name: 'Em Dash', codePoint: 'U+2014', replacement: '-', category: 'dashes' },
  { char: '\u2013', name: 'En Dash', codePoint: 'U+2013', replacement: '-', category: 'dashes' },
  { char: '\u2012', name: 'Figure Dash', codePoint: 'U+2012', replacement: '-', category: 'dashes' },
  { char: '\u2015', name: 'Horizontal Bar', codePoint: 'U+2015', replacement: '-', category: 'dashes' },
  { char: '\u2010', name: 'Hyphen', codePoint: 'U+2010', replacement: '-', category: 'dashes' },
  { char: '\u2011', name: 'Non-Breaking Hyphen', codePoint: 'U+2011', replacement: '-', category: 'dashes' },
  { char: '\u00AD', name: 'Soft Hyphen', codePoint: 'U+00AD', replacement: '', category: 'dashes' },

  // ── Spaces & Whitespace ───────────────────────────────────
  { char: '\u00A0', name: 'Non-Breaking Space', codePoint: 'U+00A0', replacement: ' ', category: 'spaces' },
  { char: '\u2002', name: 'En Space', codePoint: 'U+2002', replacement: ' ', category: 'spaces' },
  { char: '\u2003', name: 'Em Space', codePoint: 'U+2003', replacement: ' ', category: 'spaces' },
  { char: '\u2009', name: 'Thin Space', codePoint: 'U+2009', replacement: ' ', category: 'spaces' },
  { char: '\u200A', name: 'Hair Space', codePoint: 'U+200A', replacement: ' ', category: 'spaces' },
  { char: '\u202F', name: 'Narrow No-Break Space', codePoint: 'U+202F', replacement: ' ', category: 'spaces' },
  { char: '\u205F', name: 'Medium Mathematical Space', codePoint: 'U+205F', replacement: ' ', category: 'spaces' },

  // ── Invisible Characters ──────────────────────────────────
  { char: '\u200B', name: 'Zero-Width Space', codePoint: 'U+200B', replacement: '', category: 'invisible' },
  { char: '\u200C', name: 'Zero-Width Non-Joiner', codePoint: 'U+200C', replacement: '', category: 'invisible' },
  { char: '\u200D', name: 'Zero-Width Joiner', codePoint: 'U+200D', replacement: '', category: 'invisible' },
  { char: '\uFEFF', name: 'Zero-Width No-Break Space (BOM)', codePoint: 'U+FEFF', replacement: '', category: 'invisible' },
  { char: '\u200E', name: 'Left-to-Right Mark', codePoint: 'U+200E', replacement: '', category: 'invisible' },
  { char: '\u200F', name: 'Right-to-Left Mark', codePoint: 'U+200F', replacement: '', category: 'invisible' },
  { char: '\u2060', name: 'Word Joiner', codePoint: 'U+2060', replacement: '', category: 'invisible' },
  { char: '\u2061', name: 'Function Application', codePoint: 'U+2061', replacement: '', category: 'invisible' },
  { char: '\u2062', name: 'Invisible Times', codePoint: 'U+2062', replacement: '', category: 'invisible' },
  { char: '\u2063', name: 'Invisible Separator', codePoint: 'U+2063', replacement: '', category: 'invisible' },
  { char: '\u2064', name: 'Invisible Plus', codePoint: 'U+2064', replacement: '', category: 'invisible' },

  // ── Punctuation ───────────────────────────────────────────
  { char: '\u2026', name: 'Horizontal Ellipsis', codePoint: 'U+2026', replacement: '...', category: 'punctuation' },
  { char: '\u2022', name: 'Bullet', codePoint: 'U+2022', replacement: '*', category: 'punctuation' },
  { char: '\u2023', name: 'Triangular Bullet', codePoint: 'U+2023', replacement: '>', category: 'punctuation' },
  { char: '\u2043', name: 'Hyphen Bullet', codePoint: 'U+2043', replacement: '-', category: 'punctuation' },
  { char: '\u00B7', name: 'Middle Dot', codePoint: 'U+00B7', replacement: '.', category: 'punctuation' },
  { char: '\u2027', name: 'Hyphenation Point', codePoint: 'U+2027', replacement: '.', category: 'punctuation' },
  { char: '\u2032', name: 'Prime (feet/minutes)', codePoint: 'U+2032', replacement: "'", category: 'punctuation' },
  { char: '\u2033', name: 'Double Prime (inches/seconds)', codePoint: 'U+2033', replacement: '"', category: 'punctuation' },
  { char: '\u00D7', name: 'Multiplication Sign', codePoint: 'U+00D7', replacement: 'x', category: 'punctuation' },
  { char: '\u2212', name: 'Minus Sign', codePoint: 'U+2212', replacement: '-', category: 'punctuation' },
  { char: '\u2248', name: 'Almost Equal To', codePoint: 'U+2248', replacement: '~=', category: 'punctuation' },
  { char: '\u2260', name: 'Not Equal To', codePoint: 'U+2260', replacement: '!=', category: 'punctuation' },
  { char: '\u2264', name: 'Less-Than or Equal To', codePoint: 'U+2264', replacement: '<=', category: 'punctuation' },
  { char: '\u2265', name: 'Greater-Than or Equal To', codePoint: 'U+2265', replacement: '>=', category: 'punctuation' },
  { char: '\u2192', name: 'Rightwards Arrow', codePoint: 'U+2192', replacement: '->', category: 'punctuation' },
  { char: '\u2190', name: 'Leftwards Arrow', codePoint: 'U+2190', replacement: '<-', category: 'punctuation' },
  { char: '\u00A9', name: 'Copyright Sign', codePoint: 'U+00A9', replacement: '(c)', category: 'punctuation' },
  { char: '\u00AE', name: 'Registered Sign', codePoint: 'U+00AE', replacement: '(R)', category: 'punctuation' },
  { char: '\u2122', name: 'Trade Mark Sign', codePoint: 'U+2122', replacement: '(TM)', category: 'punctuation' },
  { char: '\u3010', name: 'Left Black Lenticular Bracket', codePoint: 'U+3010', replacement: '[', category: 'punctuation' },
  { char: '\u3011', name: 'Right Black Lenticular Bracket', codePoint: 'U+3011', replacement: ']', category: 'punctuation' },
  { char: '\uFF5B', name: 'Fullwidth Left Curly Bracket', codePoint: 'U+FF5B', replacement: '{', category: 'punctuation' },
  { char: '\uFF5D', name: 'Fullwidth Right Curly Bracket', codePoint: 'U+FF5D', replacement: '}', category: 'punctuation' },
]

/** Build a lookup map for fast per-character checking */
const charMap = new Map<string, UnicodeEntry>()
for (const entry of UNICODE_MAP) {
  charMap.set(entry.char, entry)
}

export interface Detection {
  index: number
  char: string
  entry: UnicodeEntry
}

/**
 * Scan text and return every non-ASCII hit along with its position.
 */
export function detectNonAscii(text: string): Detection[] {
  const hits: Detection[] = []
  for (let i = 0; i < text.length; i++) {
    const entry = charMap.get(text[i])
    if (entry) {
      hits.push({ index: i, char: text[i], entry })
    }
  }
  return hits
}

/**
 * Replace every known non-ASCII character with its ASCII equivalent.
 */
export function cleanText(text: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const entry = charMap.get(text[i])
    result += entry ? entry.replacement : text[i]
  }
  return result
}

/** Category display info */
export const CATEGORY_INFO: Record<string, { label: string; color: string }> = {
  quotes: { label: 'Smart Quotes', color: 'violet' },
  dashes: { label: 'Dashes', color: 'blue' },
  spaces: { label: 'Spaces', color: 'teal' },
  invisible: { label: 'Invisible', color: 'red' },
  punctuation: { label: 'Punctuation', color: 'orange' },
}
