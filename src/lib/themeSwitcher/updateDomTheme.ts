import { ThemeClasses, ThemeName } from './theme'
import { DEFAULT_THEME_CLASSES } from './themeClasses'
import {
  DEFAULT_THEME_MANAGER,
  isSystemDarkThemePreferred,
  isSystemTheme,
  ThemeManager,
} from './ThemeManager'

type UpdateDomThemeOptions = {
  /**
   * The target element to add the theme class
   * @default document.documentElement
   */
  targetElement?: HTMLElement
  /**
   * Class to add while transitioning to another theme
   * @default ['changing-theme']
   */
  transitioningClasses?: string[]
  themeClasses?: ThemeClasses
  /**
   * A theme manager.
   * You can choose a different storage key by creating a new instance of the theme storage and theme manager.
   * @example
   * ```ts
   * const customThemeStorage = new ThemeStorage('my-theme')
   * const customThemeManager = new ThemeManager({ themeStorage: customThemeStorage })
   * updateDomTheme({ themeManager: customThemeManager })
   * ```
   * @description The default storage uses the key `theme`
   */
  themeManager?: ThemeManager
  /**
   * Optionally pass the current theme name to set the current theme
   */
  currentTheme?: ThemeName
}

export function updateDomTheme(options: UpdateDomThemeOptions = {}) {
  const {
    targetElement = document.documentElement,
    transitioningClasses = ['transition-colors'],
    themeManager = DEFAULT_THEME_MANAGER,
    currentTheme = themeManager.getCurrentTheme(),
  } = options
  // Add the transitioning class to the target element
  addClassList(targetElement, transitioningClasses)

  const themeClasses = { ...DEFAULT_THEME_CLASSES, ...options.themeClasses }
  const themeClassesEntries = Object.entries(themeClasses) as [
    keyof typeof themeClasses,
    string[],
  ][]
  const themeToApply =
    isSystemTheme(currentTheme) && isSystemDarkThemePreferred()
      ? 'dark'
      : currentTheme

  themeClassesEntries.forEach(([themeName, classes]) => {
    if (themeName === themeToApply) {
      addClassList(targetElement, classes)
    } else {
      removeClassList(targetElement, classes)
    }
  })

  // Delayed remove transitioning classes
  window.setTimeout(() => {
    removeClassList(targetElement, transitioningClasses)
  })
}

export function addClassList(
  target: HTMLElement,
  classList: string | string[],
) {
  if (Array.isArray(classList)) {
    classList.forEach((className) => target.classList.add(className))
  } else {
    target.classList.add(classList)
  }
}

export function removeClassList(
  target: HTMLElement,
  classList: string | string[],
) {
  if (Array.isArray(classList)) {
    classList.forEach((className) => target.classList.remove(className))
  } else {
    target.classList.remove(classList)
  }
}
