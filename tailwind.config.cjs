/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#664898',
        secondary: '#463168',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
