/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta basada en el logo R - Tonos dorados/bronce profesionales
        'dark': '#0A0A0A',
        'dark-secondary': '#141414',
        'dark-tertiary': '#1E1E1E',
        'bronze': {
          50: '#FDF8F3',
          100: '#F9EDD9',
          200: '#F3DCB8',
          300: '#E8C592',
          400: '#DBA968',
          500: '#C88F4A',  // Color principal del logo
          600: '#B17739',
          700: '#8F5E2E',
          800: '#6D4623',
          900: '#4A2F18',
        },
        'gold': {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        'accent': '#C88F4A',
        'accent-light': '#DBA968',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
