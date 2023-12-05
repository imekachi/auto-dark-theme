import { useThemeSwitcher } from '@/lib/themeSwitcher/react/useThemeSwitcher'
import { THEME_NAMES, ThemeName } from '@/lib/themeSwitcher/theme'
import { ThemeManager } from '@/lib/themeSwitcher/ThemeManager'

const themeManager = new ThemeManager()

function App() {
  const { theme, setTheme } = useThemeSwitcher({ themeManager })

  return (
    <div className="grid min-h-[100dvh] place-items-center">
      <select
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemeName)}
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
