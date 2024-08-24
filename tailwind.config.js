/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'steel-blue': {
          '50': '#f4f7fb',
          '100': '#e8eef6',
          '200': '#cbdcec',
          '300': '#9dbfdc',
          '400': '#689cc8',
          '500': '#4682b4',
          '600': '#346695',
          '700': '#2b5279',
          '800': '#274665',
          '900': '#253c55',
          '950': '#182739',
        },
      },
    }
  },
  plugins: [
  ],
}

