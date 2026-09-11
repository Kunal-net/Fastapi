import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fcf9f3",
        surface: {
          DEFAULT: "#fcf9f3",
          bright: "#fcf9f3",
          dim: "#dcdad4",
          low: "#f6f3ed",
          container: "#f0eee8",
          high: "#ebe8e2",
          highest: "#e5e2dc",
          lowest: "#ffffff",
        },
        ink: {
          DEFAULT: "#1c1917",
          primary: "#1c1917",
          secondary: "#57534e",
          muted: "#7e7570",
        },
        border: {
          DEFAULT: "#e8e2d6",
          subtle: "#f0eee8",
          strong: "#d0c4be",
        },
        brand: {
          DEFAULT: "#c25e00",
          hover: "#974800",
          light: "#fff7ed",
          border: "#fdba74",
          container: "#fd8a35",
          fixed: "#ffdbc7",
          "on-fixed": "#311300",
        },
        error: {
          DEFAULT: "#ba1a1a",
          hover: "#93000a",
          container: "#ffdad6",
          "on-container": "#410002",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-geist)", "Geist", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        ambient: "0 1px 3px rgba(44, 39, 36, 0.04), 0 8px 24px -4px rgba(44, 39, 36, 0.05)",
        elevated: "0 4px 6px -1px rgba(44, 39, 36, 0.05), 0 16px 32px -4px rgba(44, 39, 36, 0.08)",
        modal: "0 20px 48px -8px rgba(44, 39, 36, 0.12), 0 1px 2px rgba(44, 39, 36, 0.06)",
        card: "0 1px 3px rgba(44, 39, 36, 0.05), 0 4px 12px rgba(44, 39, 36, 0.03)",
        "card-hover": "0 2px 6px rgba(44, 39, 36, 0.08), 0 12px 28px rgba(44, 39, 36, 0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
