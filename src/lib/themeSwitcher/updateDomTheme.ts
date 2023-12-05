import { ThemeName } from '@/lib/themeSwitcher/theme'
import {
  isDarkTheme,
  isSystemDarkThemePreferred,
  isSystemTheme,
  ThemeManager,
} from '@/lib/themeSwitcher/ThemeManager'

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
  /**
   * Classes to add to the target element when the theme is dark
   * @default ['dark']
   */
  darkClasses?: string[]
  /**
   * Classes to add to the target element when the theme is light
   * @default ['light']
   */
  lightClasses?: string[]
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
    transitioningClasses = ['changing-theme'],
    darkClasses = ['dark'],
    lightClasses = ['light'],
    themeManager = new ThemeManager(),
    currentTheme = themeManager.getCurrentTheme(),
  } = options
  // Add the transitioning class to the target element
  addClassList(targetElement, transitioningClasses)

  // Should add dark theme classes?
  if (
    isDarkTheme(currentTheme) ||
    (isSystemTheme(currentTheme) && isSystemDarkThemePreferred())
  ) {
    removeClassList(targetElement, lightClasses)
    addClassList(targetElement, darkClasses)
  } else {
    removeClassList(targetElement, darkClasses)
    addClassList(targetElement, lightClasses)
  }

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
