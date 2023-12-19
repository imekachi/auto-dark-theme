export const THEME_NAMES = ['system', 'dark', 'light'] as const

export type ThemeName = (typeof THEME_NAMES)[number]
// 'system' is just an automatically change theme of 'dark' and 'light'
export type ThemeClassesKey = Exclude<ThemeName, 'system'>
export type ThemeClasses = Partial<Record<ThemeClassesKey, string[]>>
