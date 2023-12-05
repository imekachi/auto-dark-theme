/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-primary': 'hsl(var(--color-background-primary) / <alpha-value>)',
        'foreground-primary': 'hsl(var(--color-foreground-primary) / <alpha-value>)',
        'background-input-primary': 'hsl(var(--color-background-input-primary) / <alpha-value>)',
        'foreground-input-primary': 'hsl(var(--color-foreground-input-primary) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}
