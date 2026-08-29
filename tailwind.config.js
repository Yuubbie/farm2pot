/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        charcoal: "#1B4A32",   // deep green, dark backgrounds + heading text
        terracotta: "#F2B90B", // gold, primary accent, buttons
        ember: "#F6D95C",      // light gold, hover states, eyebrow text on dark bg
        cream: "#FFFDF7",      // near-white background
        forest: "#226440",     // brand green, alt dark section bg
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
