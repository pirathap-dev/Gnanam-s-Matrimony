/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gnanam: {
          red: '#8B0000',      // Deep Red -> primary
          orange: '#CC5500',   // Burnt Orange -> accent
          gold: '#FFD700',     // Soft Yellow/Gold -> highlight
          cream: '#FFFDD0',    // Cream -> base
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
