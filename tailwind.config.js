/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0f6f5',
          100: '#d9ecea',
          200: '#b3d9d5',
          300: '#80bfb8',
          400: '#4d9d93',
          500: '#2a7a70',
          600: '#0E4B47',
          700: '#0c3f3b',
          800: '#0a322f',
          900: '#082523',
          950: '#051817',
        },
        sand: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#ebe5d4',
          300: '#ddd3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
