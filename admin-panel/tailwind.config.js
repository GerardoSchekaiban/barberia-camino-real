/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ede3d0',
        },
        espresso: {
          700: '#3d2b1f',
          800: '#2a1c12',
          900: '#1a0f08',
        },
        gold: {
          400: '#d4a853',
          500: '#c9973c',
          600: '#b8862e',
        },
        razor: {
          500: '#c0392b',
          600: '#a93226',
        }
      }
    },
  },
  plugins: [],
}
