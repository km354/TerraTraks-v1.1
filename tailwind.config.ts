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
          primary: "#000000",
          hover: "#222222",
        },
        surface: {
          white: "#FFFFFF",
          divider: "#EBEBEB",
          background: "#F7F7F7",
        },
        text: {
          primary: "#222222",
          secondary: "#717171",
        },
        badge: {
          warning: "#F5F5F5",
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

