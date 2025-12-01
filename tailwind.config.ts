import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#2E6F4E",
          sage: "#8FC89C",
        },
        surface: {
          white: "#FFFFFF",
          divider: "#F6F6F6",
          background: "#E9ECEF",
        },
        text: {
          slate: "#333A41",
        },
        alert: {
          amber: "#F6B139",
        },
      },
      borderRadius: {
        lg: "10px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 8px 20px rgba(0,0,0,0.06)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

