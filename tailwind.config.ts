import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Theme extensions are in styles/globals.css @theme directive
      colors: {
        primary: "#1a3a52",
        secondary: "#f4c430",
        neutral: {
          50: "#ffffff",
          100: "#f5f5f5",
          400: "#9ca3af",
          800: "#2d3436"
        }
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      }
    },
  },
  plugins: [],
};

export default config;
