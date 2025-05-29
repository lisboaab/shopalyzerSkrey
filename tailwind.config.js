// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(calendar|date-picker|button|ripple|spinner|date-input|form|popover).js"
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};