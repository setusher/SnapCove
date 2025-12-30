/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#0b132b',
        navy: '#1c2541',
        slate: '#3a506b',
        aqua: '#5bc0be',
        mint: '#6fffe9',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.04em',
        tighter: '-0.06em',
      },
      borderRadius: {
        'editorial': '24px',
        'editorial-lg': '36px',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'floating': '0 20px 60px -12px rgba(0, 0, 0, 0.5)',
        'floating-lg': '0 32px 80px -16px rgba(0, 0, 0, 0.6)',
        'glow-aqua': '0 0 40px rgba(91, 192, 190, 0.3)',
        'glow-mint': '0 0 60px rgba(111, 255, 233, 0.4)',
        'inner-soft': 'inset 0 2px 8px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}


