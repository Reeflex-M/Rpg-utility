/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'medievalsharp': ['MedievalSharp', 'cursive']
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%) translateX(-50%)' },
          '50%': { transform: 'translateY(0) translateX(-50%)' }
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'translateY(10px) translateX(-50%)' },
          '15%, 85%': { opacity: '1', transform: 'translateY(0) translateX(-50%)' },
          '100%': { opacity: '0', transform: 'translateY(-10px) translateX(-50%)' }
        }
      },
      animation: {
        fadeInOut: 'fadeInOut 2s ease-in-out'
      }
    },
  },
  plugins: [],
}