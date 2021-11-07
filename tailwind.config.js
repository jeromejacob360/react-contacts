module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      boxShadow: ['active'],
      opacity: ['active'],
      screens: {
        portrait: { raw: '(orientation: portrait)' },
        print: { raw: 'print' },
      },
    },
  },
  plugins: [],
};
