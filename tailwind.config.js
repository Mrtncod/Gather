/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./features/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        forest: "rgb(var(--forest) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        peach: "rgb(var(--peach) / <alpha-value>)",
        soft: "rgb(var(--soft) / <alpha-value>)",
      },
      fontFamily: { display: ["Avenir Next", "Avenir", "Segoe UI", "sans-serif"] },
    },
  },
  plugins: [],
};
