/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          DEFAULT: '#494f60',
          light: '#c0c6d6',
          dark: '#222835',
        },
        primary: {
          DEFAULT: '#514fe9',
          light: '#8c8bf3',
          dark: '#252544',
        },
      },
    },
  },
  plugins: [],
}
