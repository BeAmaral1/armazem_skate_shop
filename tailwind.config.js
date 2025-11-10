/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        // Paleta Monocromática: Preto e Branco Total
        // Usado para todo o site - visual minimalista e profissional
        
        // Preto (Dark) - Tons escuros
        dark: {
          50: '#f8f9fa',   // Cinza muito claro
          100: '#e9ecef',  // Cinza claro
          200: '#dee2e6',  // Cinza claro médio
          300: '#adb5bd',  // Cinza médio
          400: '#6c757d',  // Cinza
          500: '#495057',  // Cinza escuro
          600: '#343a40',  // Cinza muito escuro
          700: '#212529',  // Quase preto
          800: '#1a1d20',  // Preto suave
          900: '#0d0f10',  // Preto profundo
          950: '#000000',  // Preto puro
        },
        
        // Branco (Light) - Tons claros
        light: {
          50: '#ffffff',   // Branco puro
          100: '#f8f9fa',  // Branco gelo
          200: '#e9ecef',  // Branco suave
          300: '#dee2e6',  // Cinza muito claro
          400: '#ced4da',  // Cinza claro
          500: '#adb5bd',  // Cinza médio claro
          600: '#6c757d',  // Cinza médio
          700: '#495057',  // Cinza escuro
          800: '#343a40',  // Cinza muito escuro
          900: '#212529',  // Quase preto
        },
        
        // Primary (substitui ocean) - Tons de cinza para CTAs
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000',
        },
        
        // Accent (substitui sunset) - Preto para destaques
        accent: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000',
        },
        
        // Mapeamento para compatibilidade (ocean → primary)
        ocean: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000',
        },
        
        // Mapeamento para compatibilidade (sunset → accent)
        sunset: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000',
        }
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'logo': ['Anton', 'Impact', 'Arial Black', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
