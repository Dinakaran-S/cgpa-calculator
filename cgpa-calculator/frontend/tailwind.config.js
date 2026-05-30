/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f0',
          100: '#fce8df',
          500: '#e05d2c',
          600: '#c94f22',
          700: '#a83e1a',
        },
        dark: {
          900: '#0f1117',
          800: '#1a1d27',
          700: '#242736',
          600: '#2e3245',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
