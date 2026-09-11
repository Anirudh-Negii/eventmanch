/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5f0e8",
        ink: "#18211f",
        moss: "#526c5b",
        coral: "#e86f51",
        sun: "#f2c14e",
        mist: "#e6eee7",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Playfair Display", "serif"],
        mono: ["DM Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 33, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
