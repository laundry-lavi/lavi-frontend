/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./src/**/*.{js,ts,tsx}",
    "./src/components/*.{js,ts,tsx}",
    "./src/screens/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  safelist: [
    "bg-[#FFFFFF]",
    "text-[#8517A4]",
    "bg-[#222222]",
    "text-[#D88DEE]",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
