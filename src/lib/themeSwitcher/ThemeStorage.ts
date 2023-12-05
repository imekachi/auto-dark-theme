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

  get(): string | undefined {
    return localStorage.getItem(this.key) ?? undefined
  }

  set(themeName: string) {
    localStorage.setItem(this.key, themeName)
  }
}
