/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B6B2A',
          dark: '#0D4A1A',
          light: '#2E8B3E',
          lighter: '#E8F5E9',
        },
        accent: {
          DEFAULT: '#C8A951',
          light: '#F5EEDC',
        },
        ink: {
          DEFAULT: '#1A1A2E',
          light: '#2D2D44',
        },
        body: {
          DEFAULT: '#4A4A5A',
          light: '#7A7A8A',
        },
        border: '#E0E8E2',
        surface: '#F5F9F6',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        brand: '12px',
        'brand-lg': '20px',
      },
      boxShadow: {
        brand: '0 4px 20px rgba(27, 107, 42, 0.08)',
        'brand-lg': '0 12px 40px rgba(27, 107, 42, 0.12)',
        'brand-xl': '0 20px 60px rgba(27, 107, 42, 0.15)',
      },
      keyframes: {
        scrollBounce: {
          '0%, 100%': { top: '8px', opacity: '1' },
          '50%': { top: '22px', opacity: '0.3' },
        },
        heroFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        whatsappPulse: {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)' },
          '50%': { boxShadow: '0 4px 30px rgba(37, 211, 102, 0.6)' },
        },
        daStepsShimmer: {
          '0%': { backgroundPosition: '0% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'hero-float': 'heroFloat 6s ease-in-out infinite',
        'whatsapp-pulse': 'whatsappPulse 2s ease-in-out infinite',
        'da-shimmer': 'daStepsShimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
