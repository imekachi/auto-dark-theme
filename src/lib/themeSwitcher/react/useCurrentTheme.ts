import { useSyncExternalStore } from 'react'
import { DEFAULT_THEME_MANAGER, ThemeManager } from '../ThemeManager'

export type UseCurrentThemeOptions = {
  /**
   * The theme manager to use.
   */
  themeManager?: ThemeManager
}

export function useCurrentTheme(options: UseCurrentThemeOptions = {}) {
  const { themeManager = DEFAULT_THEME_MANAGER } = options

  return useSyncExternalStore(
    themeManager.subscribe,
    themeManager.getCurrentTheme,
  )
}
