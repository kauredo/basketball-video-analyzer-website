/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF4ED",
          100: "#FFE6D5",
          200: "#FFD0AA",
          300: "#FFB274",
          400: "#FF8A5C",
          500: "#FF6B35",
          600: "#E55A2B",
          700: "#CC4A1F",
          800: "#B33E17",
          900: "#99340F",
        },
        court: {
          wood: "#D4A574",
          line: "#FFFFFF",
          net: "#E8E8E8",
        },
        warm: {
          50: "#FDFBF7",
          100: "#F9F5ED",
          200: "#F0E8D8",
          300: "#E3D5BD",
          400: "#C9B494",
          500: "#A8906A",
          600: "#8B7355",
          700: "#6E5A42",
          800: "#4A3C2C",
          900: "#2C2418",
          950: "#1A1510",
        },
      },
      fontFamily: {
        display: [
          "Space Grotesk",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
        body: ["DM Sans", "SF Pro Text", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
