/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Practo/Medical emerald & teal tones
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        practo: {
          blue: '#199fd9', // Classic Practo Cyan/Blue
          darkBlue: '#144e7e',
          navy: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
