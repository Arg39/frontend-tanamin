/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#ebfbf1', // greenLight
          200: '#e1f9ea', // greenLightHover
          300: '#c1f2d3', // greenLightActive
          400: '#36d670', // greenNormal
          500: '#31c165', // greenNormalHover
          600: '#2bab5a', // greenNormalActive
          700: '#29a154', // greenDark
          800: '#208043', // greenDarkHover
          850: '#186032', // greenDarkActive
          900: '#134b27', // greenDarker
        },
        secondary: {
          100: '#f4fbfd', // brightblueLight
          200: '#eef8fc', // brightblueLightHover
          300: '#dbf1f8', // brightblueLightActive
          400: '#8cd3e9', // brightblueNormal
          500: '#7ebed2', // brightblueNormalHover
          600: '#70a9ba', // brightblueNormalActive
          700: '#699eaf', // brightblueDark
          800: '#547f8c', // brightblueDarkHover
          850: '#3f5f69', // brightblueDarkActive
          900: '#314a52', // brightblueDarker
        },
        accent: {
          100: '#eff5fc', // darkblueLight
          200: '#e7f0fa', // darkblueLightHover
          300: '#cde0f5', // darkblueLightActive
          400: '#5d9ce0', // darkblueNormal
          500: '#548cca', // darkblueNormalHover
          600: '#4a7db3', // darkblueNormalActive
          700: '#4675a8', // darkblueDark
          800: '#385e86', // darkblueDarkHover
          850: '#2a4665', // darkblueDarkActive
          900: '#21374e', // darkblueDarker
        },
        black: {
          100: '#e6e8e7', // blackLight
          200: '#d9dcda', // blackLightHover
          300: '#b1b7b3', // blackLightActive
          400: '#04170b', // blackNormal
          500: '#04150a', // blackNormalHover
          600: '#031209', // blackNormalActive
          700: '#031108', // blackDark
          800: '#020e07', // blackDarkHover
          850: '#020a05', // blackDarkActive
          900: '#010804', // blackDarker
        },
        white: {
          100: '#fefffe', // whiteLight
          200: '#fefffe', // whiteLightHover
          300: '#fcfefd', // whiteLightActive
          400: '#f6fcf8', // whiteNormal
          500: '#dde3df', // whiteNormalHover
          600: '#c5cac6', // whiteNormalActive
          700: '#b9bdba', // whiteDark
          800: '#949795', // whiteDarkHover
          850: '#6f7170', // whiteDarkActive
          900: '#565857', // whiteDarker
        },
      },
    },
  },
  plugins: [],
};
