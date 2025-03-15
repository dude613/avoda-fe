/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", 
        secondary: "#9333EA", 
        accent: "#FACC15",
        background: "#000000",
        textPrimary: "#111827",
        text: "#FFFFFF",
      },
    },
  },
  plugins: [],
}

