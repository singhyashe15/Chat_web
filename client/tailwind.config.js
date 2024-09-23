/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        lightGray: '#E0E0E0',
        fgreen:'#111111'
      },
      width:{
        '30rem' : '30rem',
        '10.75rem' : '10.75rem'
      }
    },
  },
  plugins: [],
}

