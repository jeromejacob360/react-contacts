module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
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
      display: ['hover', 'group-hover'],
      backgroundColor: ['odd'],
    },
  },
  plugins: [],
};
