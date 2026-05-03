/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5f0e4",
        "paper-2": "#ede8d8",
        "paper-3": "#e4ddc8",
        ink: "#1a1408",
        "ink-2": "#3a3020",
        "ink-3": "#6b6050",
        "ink-4": "#9a9080",
        crimson: "#b23b3b",
        "crimson-2": "#d45454",
        highlight: "#fae3a8",
        "highlight-2": "#f7d680",
      },
      fontFamily: {
        serif: ["var(--serif)", "serif"],
        lora: ["var(--lora)", "serif"],
        hand: ["var(--hand)", "cursive"],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};
