import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-deep': '#0F0A1E',
        'navy-panel': '#1B1330',
        'pink-soft': '#F7A8C4',
        'pink-hot': '#FF3E8E',
        'lavender': '#B6A6E8',
        'cream': '#F5EEE0',
        'pixel-gold': '#FFC94D',
        'electric-blue': '#4FD6FF',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
