/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌑 Modo Dark - Cian Técnico
        'dark': '#020617',            // BG principal
        'dark-secondary': '#020617',  // Superficies y cards
        'dark-tertiary': '#1E293B',   // Bordes y divisores
        
        // ☀️ Modo Light - Limpio y profesional
        'light': '#FFFFFF',           // BG principal
        'light-secondary': '#F8FAFC', // Superficies y cards
        'light-tertiary': '#E2E8F0',  // Bordes
        
        // Sistema de textos
        'text-primary-dark': '#E5E7EB',    // Texto principal en dark
        'text-secondary-dark': '#94A3B8',  // Texto muted en dark
        'text-primary-light': '#020617',   // Texto principal en light
        'text-secondary-light': '#475569', // Texto muted en light
        
        // Acento Cian Técnico - La personalidad controlada
        'accent': {
          DEFAULT: '#22D3EE',  // Dark mode accent
          'light': '#0891B2',  // Light mode accent
          'hover': '#06B6D4',  // Hover state
        },
        
        // Paleta bronze actualizada con cian
        'bronze': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#22D3EE',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        
        // Gold reemplazado por tonos cian
        'gold': {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
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
