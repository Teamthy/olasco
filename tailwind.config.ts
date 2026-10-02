import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111311",
        paper: "#f4f3ef",
        lime: "#d8f36a",
        stone: "#777a74",
      },
      fontFamily: {
        sans: ["Manrope", "Arial", "sans-serif"],
      },
      maxWidth: { content: "80rem" },
    },
  },
  plugins: [],
};

export default config;
