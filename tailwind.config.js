// File: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Our custom animation (this part was correct)
      animation: {
        "aurora": "aurora 60s linear infinite",
      },
      keyframes: {
        "aurora": {
          from: {
            "background-position": "50% 50%, 50% 50%",
          },
          to: {
            "background-position": "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  plugins: [],
};