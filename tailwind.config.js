module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // ✅ Added Poppins globally
      },
      fontSize: {
        // Responsive heading sizes
        h1: ['2.25rem', { lineHeight: '2.5rem' }], // base: 36px
        h2: ['1.875rem', { lineHeight: '2.25rem' }],
        h3: ['1.6rem', { lineHeight: '2rem' }],
        h4: ['1.45rem', { lineHeight: '1.75rem' }],
        h5: ['1.225rem', { lineHeight: '1.5rem' }],
        h6: ['1rem', { lineHeight: '1.5rem' }],
        p: ['1rem', { lineHeight: '1.5rem' }],
      },
    },
  },
  plugins: [],
};
