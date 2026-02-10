/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#023681',
          50: '#e6eef9',
          100: '#ccddf3',
          200: '#99bbe7',
          300: '#6699db',
          400: '#3377cf',
          500: '#023681',
          600: '#022b67',
          700: '#01204d',
          800: '#011533',
          900: '#000b1a',
        },
        secondary: {
          DEFAULT: '#fcdb2f',
          50: '#fffbeb',
          100: '#fef7d6',
          200: '#fdefad',
          300: '#fce784',
          400: '#fcdf5b',
          500: '#fcdb2f',
          600: '#e4c41a',
          700: '#b89815',
          800: '#8c6c10',
          900: '#60400b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
