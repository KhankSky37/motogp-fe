/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        MGPDisplay: ['MGPDisplay', 'sans-serif'],
        MGPInline: ['MGPInline', 'sans-serif'],
        MGPText: ['MGPText', 'sans-serif'],
      },
      // fontWeight: {
      //   thin: '100',
      //   light: '300',
      //   regular: '400',
      //   medium: '500',
      //   bold: '700',
      //   black: '900',
      // },
      colors: {
        'colorText': '#C6C6C6',
      }
    },
  },
  plugins: [],
}
