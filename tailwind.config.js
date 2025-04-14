/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stalker-dark': '#121212',
        'stalker-accent': '#00ff00', // Neon green for a "stalker" theme
        'stalker-gray': '#2a2a2a',
        'stalker-light': '#e0e0e0',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'handwriting': ['Caveat', 'cursive'],
      },
      boxShadow: {
        'neon': '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00',
        'blink': '0 0 7px #00ff00, 0 0 10px #00ff00',
      },
    },
  },
  plugins: [],
}
