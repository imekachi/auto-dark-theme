import {
  Dispatch,
  SetStateAction,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { useCurrentTheme } from '@/lib/themeSwitcher/react/useCurrentTheme'
import {
  getSystemDarkThemeMediaQuery,
  isSystemTheme,
  ThemeManager,
} from '@/lib/themeSwitcher/ThemeManager'
import { updateDomTheme } from '@/lib/themeSwitcher/updateDomTheme'

const DEFAULT_THEME_MANAGER = new ThemeManager()

export type UseThemeSwitcherOptions = {
  themeManager?: ThemeManager
  /**
   * @default true
   */
  shouldSyncDomThemeOnMount?: boolean
}

export function useThemeSwitcher(options: UseThemeSwitcherOptions = {}) {
  const {
    themeManager = DEFAULT_THEME_MANAGER,
    shouldSyncDomThemeOnMount = true,
  } = options

  const theme = useCurrentTheme()

  const setTheme: Dispatch<SetStateAction<typeof theme>> = useCallback(
    (newTheme) => {
      const nextTheme =
        typeof newTheme === 'function'
          ? newTheme(themeManager.getCurrentTheme())
          : newTheme

      themeManager.setCurrentTheme(nextTheme)
      updateDomTheme({ themeManager, currentTheme: nextTheme })

      return nextTheme
    },
    [themeManager],
  )

  // Sync the selected theme with DOM for the first render
  const isReactStateAndDomThemeInSyncRef = useRef(false)
  useLayoutEffect(() => {
    if (
      shouldSyncDomThemeOnMount &&
      !isReactStateAndDomThemeInSyncRef.current
    ) {
      updateDomTheme({ themeManager })
      isReactStateAndDomThemeInSyncRef.current = true
      return
    }
  }, [shouldSyncDomThemeOnMount, themeManager])

  // Sync React state and DOM theme with external changes
  const syncDomThemeWithReactState = useCallback(() => {
    updateDomTheme({ themeManager })
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
