/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1A1714',
        'dark-alt': '#141210',
        'dark-secondary': '#221E1B',
        'dark-tertiary': '#3F3832',

        light: '#F7F3EE',
        'light-secondary': '#FFFCF8',
        'light-tertiary': '#E4D9CC',

        cream: '#F7F3EE',
        sand: '#EFE8DF',
        surface: {
          DEFAULT: '#FFFCF8',
          dark: '#221E1B',
        },
        ink: {
          DEFAULT: '#1C1917',
          dark: '#F5F0EA',
        },
        subtle: {
          DEFAULT: '#57534E',
          dark: '#C4B8AD',
        },
        line: {
          DEFAULT: '#E4D9CC',
          dark: '#3F3832',
        },
        brand: {
          DEFAULT: '#0F6B63',
          hover: '#0B4F4A',
          dark: '#5EC8BC',
          'dark-hover': '#7DD8CE',
          soft: '#D7EDEB',
        },

        'text-primary-dark': '#F5F0EA',
        'text-secondary-dark': '#C4B8AD',
        'text-primary-light': '#1C1917',
        'text-secondary-light': '#57534E',

        accent: {
          DEFAULT: '#5EC8BC',
          light: '#0F6B63',
          hover: '#0B4F4A',
        },

        bronze: {
          50: '#F7F3EE',
          100: '#EFE8DF',
          200: '#E4D9CC',
          300: '#D2C4B4',
          400: '#A89888',
          500: '#0F6B63',
          600: '#0F6B63',
          700: '#0B4F4A',
          800: '#0A3F3B',
          900: '#1A1714',
        },

        gold: {
          50: '#F7F3EE',
          100: '#EFE8DF',
          200: '#E4D9CC',
          300: '#C4B8AD',
          400: '#5EC8BC',
          500: '#2A9D8F',
          600: '#0F6B63',
          700: '#0B4F4A',
          800: '#0A3F3B',
          900: '#1A1714',
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
