import { THEME_NAMES, ThemeName } from '@/lib/themeSwitcher/theme'
import { ThemeStorage } from '@/lib/themeSwitcher/ThemeStorage'

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

  constructor(options: ThemeManagerOptions = {}) {
    this.themeStorage = options.themeStorage ?? new ThemeStorage()
    this.defaultTheme = options.defaultTheme ?? THEME_NAMES[0]
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
