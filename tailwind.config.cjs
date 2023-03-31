/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#D55CFF',
        secondary: '#9936BC',
        'secondary-dark': '#7A2C9B',
      },
    },
  },
  plugins: [],
}
