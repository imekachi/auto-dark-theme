export const THEME_NAMES = ['system', 'dark', 'light'] as const

export type ThemeName = (typeof THEME_NAMES)[number]
