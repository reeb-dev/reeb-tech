/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Tech Premium - Sobria y escalable para Senior Developers
        'dark': '#0B0D10',           // Negro profundo (no puro) - Fondo principal
        'dark-secondary': '#111827',  // Superficies y cards
        'dark-tertiary': '#1F2933',   // Bordes y divisores
        
        // Sistema de grises profesionales
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        
        // Acento Tech (azul tecnológico)
        'accent': '#60A5FA',
        'accent-light': '#93C5FD',
        'accent-dark': '#3B82F6',
        
        // Paleta bronze mantenida para compatibilidad
        'bronze': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#60A5FA',  // Acento tech
          600: '#3B82F6',
          700: '#2563EB',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        
        // Gold reemplazado por tonos tech
        'gold': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#60A5FA',
          600: '#3B82F6',
          700: '#2563EB',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
