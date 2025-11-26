/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        norvan: {
          navy: '#0A1628',
          cyan: '#00A6FB',
          blue: '#0582CA',
          sky: '#006494',
          steel: '#003554',
          accent: '#00D9FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
