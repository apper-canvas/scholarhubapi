/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
colors: {
        primary: '#14B8A6',
        'primary-dark': '#0F766E',
        'primary-light': '#5EEAD4',
        'surface': '#F0FDFA',
        success: '#10B981',
        'success-dark': '#059669',
        'success-light': '#6EE7B7',
        warning: '#F59E0B',
        'warning-dark': '#D97706',
        'warning-light': '#FCD34D',
        error: '#EF4444',
        'error-dark': '#DC2626',
        'error-light': '#FCA5A5',
        info: '#3B82F6',
        'info-dark': '#2563EB',
        'info-light': '#93C5FD',
      },
      animation: {
        'scale-in': 'scaleIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
},
      },
      scale: {
        '102': '1.02',
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(20, 184, 166, 0.1)',
      },
    },
  },
  plugins: [],
}