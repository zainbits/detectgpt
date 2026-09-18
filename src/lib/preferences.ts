export interface Preferences {
  autoCopy: boolean
  replaceLongDashes: boolean
}

export const PREFERENCES_KEY = 'detectgpt.preferences.v1'
export const DEFAULT_PREFERENCES: Preferences = {
  autoCopy: false,
  replaceLongDashes: true,
}

/** Save settings only, never the text being cleaned. */
export function readPreferences(): Preferences {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? 'null')
    if (!saved || typeof saved !== 'object') return { ...DEFAULT_PREFERENCES }
    const values = saved as Record<string, unknown>
    return {
      autoCopy: typeof values.autoCopy === 'boolean' ? values.autoCopy : DEFAULT_PREFERENCES.autoCopy,
      replaceLongDashes: typeof values.replaceLongDashes === 'boolean'
        ? values.replaceLongDashes
        : DEFAULT_PREFERENCES.replaceLongDashes,
    }
  } catch {
    // Storage can be unavailable in private sessions or restricted browser contexts.
    return { ...DEFAULT_PREFERENCES }
  }
}

export function savePreferences(preferences: Preferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
  } catch {
    // The switches still work for this session when persistence is unavailable.
  }
}
