// File: postcss.config.js

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- THIS IS THE FIX
    autoprefixer: {},
  },
};