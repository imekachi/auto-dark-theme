import type { ThemeName } from '@/lib/themeSwitcher/theme'

export type ThemeStorageOptions = {
  /**
   * A storage key for the theme
   * @default 'theme'
   */
  key?: string
}

export class ThemeStorage {
  key: string

  constructor(options: ThemeStorageOptions = {}) {
    this.key = options.key ?? 'theme'
  }

  get(): ThemeName | undefined {
    return (localStorage.getItem(this.key) as ThemeName | null) ?? undefined
  }

  set(themeName: ThemeName) {
    localStorage.setItem(this.key, themeName)
  }
}
