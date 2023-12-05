import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { THEME_NAMES, ThemeName } from '@/lib/themeSwitcher/theme'
import {
  getSystemDarkThemeMediaQuery,
  isSystemTheme,
  ThemeManager,
} from '@/lib/themeSwitcher/ThemeManager'
import { ThemeStorage } from '@/lib/themeSwitcher/ThemeStorage'
import { updateDomTheme } from '@/lib/themeSwitcher/updateDomTheme'

const themeManager = new ThemeManager({
  themeStorage: new ThemeStorage(),
  defaultTheme: 'system',
})

function App() {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return themeManager.getCurrentTheme()
  })

  const isReactStateAndDomThemeInSyncRef = useRef(false)
  useLayoutEffect(() => {
    if (!isReactStateAndDomThemeInSyncRef.current) {
      updateDomTheme({ themeManager })
      isReactStateAndDomThemeInSyncRef.current = true
      return
    }
  }, [])

  const handleThemeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Selected theme: ', event.target.value)
    const newTheme = event.target.value as ThemeName
    setSelectedTheme(newTheme)
    themeManager.setCurrentTheme(newTheme)
    updateDomTheme({ themeManager, currentTheme: newTheme })
  }

  const syncDomThemeWithReactState = useCallback(() => {
    updateDomTheme({ themeManager })
    setSelectedTheme(themeManager.getCurrentTheme())
  }, [])

  // Handle changes to the theme storage
  useLayoutEffect(() => {
    window.addEventListener('storage', syncDomThemeWithReactState)

    return () => {
      window.removeEventListener('storage', syncDomThemeWithReactState)
    }
  }, [syncDomThemeWithReactState])

  // handle changes to the system theme
  useLayoutEffect(() => {
    const mediaQuery = getSystemDarkThemeMediaQuery()

    if (isSystemTheme(selectedTheme)) {
      mediaQuery.addEventListener('change', syncDomThemeWithReactState)
    }

    return () => {
      mediaQuery.removeEventListener('change', syncDomThemeWithReactState)
    }
  }, [selectedTheme, syncDomThemeWithReactState])

  return (
    <div className="grid min-h-[100dvh] place-items-center">
      <select
        value={selectedTheme}
        onChange={handleThemeSelect}
        className="bg-background-input-primary text-foreground-input-primary rounded-lg p-4 font-semibold capitalize shadow"
      >
        {THEME_NAMES.map((name) => {
          return (
            <option key={name} className="capitalize" value={name}>
              {name}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default App
