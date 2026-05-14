/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F4',
        sand: '#E8E0D4',
        gold: { DEFAULT: '#B8975A', light: '#D4B483', dark: '#8A6E40' },
        sage: { DEFAULT: '#8BAE9B', light: '#B0C9BC', dark: '#6B8E7E' },
        ink: { DEFAULT: '#2C2416', light: '#5C4E3A', muted: '#8B7A65' },
        paper: '#FFFFFF',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
