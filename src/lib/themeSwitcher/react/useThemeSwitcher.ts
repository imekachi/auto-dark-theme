import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ThemeName } from '@/lib/themeSwitcher/theme'
import {
  getSystemDarkThemeMediaQuery,
  isSystemTheme,
  ThemeManager,
} from '@/lib/themeSwitcher/ThemeManager'
import { updateDomTheme } from '@/lib/themeSwitcher/updateDomTheme'

const DEFAULT_THEME_MANAGER = new ThemeManager()

export type UseThemeSwitcherOptions = {
  themeManager?: ThemeManager
}

export function useThemeSwitcher(options: UseThemeSwitcherOptions = {}) {
  const { themeManager = DEFAULT_THEME_MANAGER } = options

  // React state for the selected theme
  const [theme, _setTheme] = useState<ThemeName>(() => {
    return themeManager.getCurrentTheme()
  })

  const setTheme: typeof _setTheme = useCallback(
    (newTheme) => {
      _setTheme((prevTheme) => {
        const nextTheme =
          typeof newTheme === 'function' ? newTheme(prevTheme) : newTheme

        themeManager.setCurrentTheme(nextTheme)
        updateDomTheme({ themeManager, currentTheme: nextTheme })

        return nextTheme
      })
    },
    [themeManager],
  )

  // Sync the selected theme with DOM for the first render
  const isReactStateAndDomThemeInSyncRef = useRef(false)
  useLayoutEffect(() => {
    if (!isReactStateAndDomThemeInSyncRef.current) {
      updateDomTheme({ themeManager })
      isReactStateAndDomThemeInSyncRef.current = true
      return
    }
  }, [themeManager])

  // Sync React state and DOM theme with external changes
  const syncDomThemeWithReactState = useCallback(() => {
    updateDomTheme({ themeManager })
    _setTheme(themeManager.getCurrentTheme())
  }, [themeManager])

  // Handle changes from the system theme
  useLayoutEffect(() => {
    const mediaQuery = getSystemDarkThemeMediaQuery()

    if (isSystemTheme(theme)) {
      mediaQuery.addEventListener('change', syncDomThemeWithReactState)
    }

    return () => {
      mediaQuery.removeEventListener('change', syncDomThemeWithReactState)
    }
  }, [theme, syncDomThemeWithReactState])

  // Handle changes from another tab.
  // The 'storage' event won't work on the page that is making changes.
  // It's for other pages on the domain using the storage to sync any changes that are made.
  useLayoutEffect(() => {
    window.addEventListener('storage', syncDomThemeWithReactState)

    return () => {
      window.removeEventListener('storage', syncDomThemeWithReactState)
    }
  }, [syncDomThemeWithReactState])

  return useMemo(() => {
    return { theme, setTheme }
  }, [theme, setTheme])
}
