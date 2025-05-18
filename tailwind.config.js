/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // Genaue Breakpoints basierend auf den Anforderungen
      sm: '576px',      // Kleine Bildschirme, Mobilgeräte im Querformat
      md: '768px',      // Tablets
      lg: '1024px',     // Desktop, kleine Laptops
      xl: '1280px',     // Große Laptops, Desktop
      '2xl': '1536px',  // Sehr große Bildschirme
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',  // 20px Grundpadding auf allen Bildschirmen
        sm: '1.5rem',        // 24px auf kleinen Bildschirmen
        md: '2rem',          // 32px auf mittleren Bildschirmen
        lg: '3rem',          // 48px auf großen Bildschirmen
        xl: '4rem',          // 64px auf sehr großen Bildschirmen
        '2xl': '5rem',       // 80px auf den größten Bildschirmen
      },
      // Maximale Containerbreite auf 1814px gesetzt
      maxWidth: {
        DEFAULT: '100%',
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        'brand-olive': {
          DEFAULT: '#93A27F',
          50: '#F0F2ED',
          100: '#E1E5DB',
          200: '#C3CBB7',
          300: '#A5B293',
          400: '#93A27F', // Hauptfarbe
          500: '#788A64',
          600: '#5F6E4F',
          700: '#45523A',
          800: '#2C3525',
          900: '#141810',
        },
        'brand-gray': {
          50: '#F0F5FA',
          100: '#E9EDF5',
          200: '#D4DBEA',
          300: '#AAB4C8',
          400: '#8D99B0',
          500: '#6B7A94',
          600: '#566278',
          700: '#1e293b',
          800: '#334155',
          900: '#111827',
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.5s ease-out',
        'slideDown': 'slideDown 0.5s ease-out',
        'slideLeft': 'slideLeft 0.5s ease-out',
        'slideRight': 'slideRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      fontFamily: {
        sans: ['Brooklyn', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        brooklyn: ['Brooklyn', 'sans-serif'],
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '16/9': '16 / 9',
        '3/2': '3 / 2',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      gridTemplateColumns: {
        // 12-Spalten-Grid-System
        '12': 'repeat(12, minmax(0, 1fr))',
        // 24-Spalten-Grid-System für präzisere Layouts
        '24': 'repeat(24, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '540px',
          },
          '@screen md': {
            maxWidth: '720px',
          },
          '@screen lg': {
            maxWidth: '960px',
          },
          '@screen xl': {
            maxWidth: '1280px',
          },
          '@screen 2xl': {
            maxWidth: '1536px',
          },
        }
      })
    }
  ],
}