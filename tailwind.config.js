/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#effef0',
          100: '#dafedd',
          200: '#b7fbbd',
          300: '#7ff68b',
          400: '#40e852',
          500: '#17d02b',
          600: '#0dac1f',
          700: '#0e871c',
          800: '#116a1c',
          900: '#0d4715', // utama
          950: '#02310a',
        },
        secondary: {
          50: '#f3f6f4',
          100: '#e1eae1',
          200: '#c4d6c6',
          300: '#9db8a1',
          400: '#719678',
          500: '#51785a',
          600: '#41644a', // utama
          700: '#314b39',
          800: '#283d2e',
          900: '#223227',
          950: '#121c15',
        },
        tertiary: {
          50: '#fef7ee',
          100: '#fcecd8',
          200: '#f8d6b0',
          300: '#f3b87e',
          400: '#ed914a',
          500: '#e9762b', // utama
          600: '#da5a1c',
          700: '#b54519',
          800: '#90371c',
          900: '#74301a',
          950: '#3f150b',
        },
        neutral: {
          50: '#f8f7f4',
          100: '#f1f0e9', // utama
          200: '#dddacb',
          300: '#c8c2a9',
          400: '#b1a686',
          500: '#a1926e',
          600: '#948262',
          700: '#7b6b53',
          800: '#655747',
          900: '#53483b',
          950: '#2c251e',
        },
        warning: {
          50: '#fef9ec',
          100: '#fcedc9',
          200: '#f8d88f',
          300: '#f4b740', // utama
          400: '#f3a62c',
          500: '#ec8514',
          600: '#d1620e',
          700: '#ad4410',
          800: '#8d3413',
          900: '#742c13',
          950: '#421506',
        },
        error: {
          50: '#fdf3f3',
          100: '#fde3e3',
          200: '#fbcdcd',
          300: '#f8a9a9',
          400: '#f17878',
          500: '#e74c4c',
          600: '#d32f2f', // utama
          700: '#b12424',
          800: '#932121',
          900: '#7a2222',
          950: '#420d0d',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
