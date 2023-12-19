// @ts-check

/**
 * This has to be in a js file
 * because it will be imported in tailwind config as well for generating theme variants
 *
 * @satisfies {import('./theme').ThemeClasses}
 */
export const DEFAULT_THEME_CLASSES = {
  dark: ['dark'],
  light: ['light'],
}
