/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#787878", //color - gray
        secondary: "#9333EA", // color - Purple
        accent: "#FACC15", // color - Yellow
        background: "#000000", // color - Black
        textPrimary: "#111827", // text color - Dark Gray
        text: "#FFFFFF", // color - White
        textMandatory: "#EF4444", // text color - Red
      },
    },
  },
  plugins: [],
}

