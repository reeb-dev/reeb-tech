/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1C1610',
        'dark-alt': '#14110D',
        'dark-secondary': '#2A221A',
        'dark-tertiary': '#4A3D32',

        light: '#EFE2C6',
        'light-secondary': '#FFF8EC',
        'light-tertiary': '#D4BC90',

        cream: '#EFE2C6',
        sand: '#E4CC9A',
        surface: {
          DEFAULT: '#FFF8EC',
          dark: '#2A221A',
        },
        ink: {
          DEFAULT: '#2A1C12',
          dark: '#F8F0E4',
        },
        subtle: {
          DEFAULT: '#6B5340',
          dark: '#CDB9A0',
        },
        line: {
          DEFAULT: '#D4BC90',
          dark: '#4A3D32',
        },
        brand: {
          DEFAULT: '#0A5C54',
          hover: '#084843',
          dark: '#6ED9CC',
          'dark-hover': '#8EE6DB',
          soft: '#D4EBE6',
        },

        'text-primary-dark': '#F8F0E4',
        'text-secondary-dark': '#CDB9A0',
        'text-primary-light': '#2A1C12',
        'text-secondary-light': '#6B5340',

        accent: {
          DEFAULT: '#6ED9CC',
          light: '#0A5C54',
          hover: '#084843',
        },

        bronze: {
          50: '#EFE2C6',
          100: '#E4CC9A',
          200: '#D4BC90',
          300: '#C4A574',
          400: '#A88858',
          500: '#0A5C54',
          600: '#0A5C54',
          700: '#084843',
          800: '#063832',
          900: '#1C1610',
        },

        gold: {
          50: '#EFE2C6',
          100: '#E4CC9A',
          200: '#D4BC90',
          300: '#CDB9A0',
          400: '#6ED9CC',
          500: '#2A9D8F',
          600: '#0A5C54',
          700: '#084843',
          800: '#063832',
          900: '#1C1610',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'brand': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
