/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
      "./app.vue"
    ],
  theme: {
    extend: {
      colors: {
        'primaryBlue': '#2F80ED',
        'secondaryBlue': '#286ec9',
        'thirdaryBlue': '#1f58a1',
        'primaryGray': '#828282',
        'secondaryGray': '#4F4F4F',
        'thirdaryGray': '#F2F2F2',
        'primaryBlack': '#333333'
      }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'noto-sans': ['Noto Sans', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'cuprum': ['Cuprum', 'Impact', 'sans-serif'],
        'kelly-slab': ['kelly slab', 'Impact', 'sans-serif'],
      },
  },
  plugins: [],
  darkMode: ['selector', '[data-mode="dark"]']
}