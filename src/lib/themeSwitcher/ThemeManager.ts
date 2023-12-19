import { THEME_NAMES, ThemeName } from '@/lib/themeSwitcher/theme'
import { ThemeStorage } from '@/lib/themeSwitcher/ThemeStorage'

export type ThemeEventListener = (themeName: ThemeName) => void
export type ThemeEvent = 'change'

export type ThemeManagerOptions = {
  /**
   * A storage handler for the theme.
   */
  themeStorage?: ThemeStorage
  /**
   * The default theme to use when the storage is empty or invalid
   */
  defaultTheme?: ThemeName
}

export class ThemeManager {
  themeStorage: ThemeStorage
  defaultTheme: ThemeName
  listeners: Record<ThemeEvent, ThemeEventListener[]> = {
    change: [],
  }

  constructor(options: ThemeManagerOptions = {}) {
    this.themeStorage = options.themeStorage ?? new ThemeStorage()
    this.defaultTheme = options.defaultTheme ?? THEME_NAMES[0]

    // Prevent context issues when passing these methods as callbacks
    this.getCurrentTheme = this.getCurrentTheme.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
  }

  getCurrentTheme(): ThemeName {
    const rawTheme = this.themeStorage.get() ?? this.defaultTheme
    // If the theme data is invalid, return the default theme
    return isValidThemeName(rawTheme) ? rawTheme : this.defaultTheme
  }

  setCurrentTheme(themeName: string) {
    const newThemeName = isValidThemeName(themeName)
      ? themeName
      : this.defaultTheme

    this.themeStorage.set(newThemeName)

    this.listeners.change.forEach((listener) => {
      try {
        listener(newThemeName)
      } catch (err) {
        console.error(
          '[ThemeManager] An error occurred from a listener to "change" theme event.',
          err,
        )
      }
    })
  }

  addEventListener(event: ThemeEvent, listener: ThemeEventListener) {
    this.listeners[event].push(listener)

    return () => {
      this.removeEventListener(event, listener)
    }
  }

  removeEventListener(event: ThemeEvent, listener: ThemeEventListener) {
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener)
  }

  // Make it easier to use with Frameworks e.g. React
  subscribe(listener: ThemeEventListener) {
    return this.addEventListener('change', listener)
  }

  unsubscribe(listener: ThemeEventListener) {
    return this.removeEventListener('change', listener)
  }
}

export function isDarkTheme(themeName: ThemeName): themeName is 'dark' {
  return themeName === 'dark'
}

export function isSystemTheme(themeName: ThemeName): themeName is 'system' {
  return themeName === 'system'
}

export function isValidThemeName(themeName: string): themeName is ThemeName {
  return THEME_NAMES.includes(themeName as ThemeName)
}

/**
 * Get user's system theme preference
 */
export function getSystemDarkThemeMediaQuery() {
  return window.matchMedia('(prefers-color-scheme: dark)')
}

export function isSystemDarkThemePreferred(
  mediaQuery: MediaQueryList = getSystemDarkThemeMediaQuery(),
) {
  return mediaQuery.matches
}

export const DEFAULT_THEME_MANAGER = new ThemeManager()