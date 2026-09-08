/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // The one accent, and it has one job: the action being taken right
        // now. 500 and 600 are the same hexes the desktop app uses for its
        // action colour, so a coach clicking Download and then opening the
        // program sees one colour do one thing.
        primary: {
          50: "#F0F9F9",
          100: "#DDF3F2",
          200: "#BAE8E5",
          300: "#8BDAD5",
          400: "#2FC6BC",
          500: "#0B7972",
          600: "#075450",
          700: "#064742",
          800: "#043935",
          900: "#032B28",
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
          "Space Grotesk Variable",
          "Space Grotesk",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
        body: ["DM Sans Variable", "DM Sans", "SF Pro Text", "system-ui", "sans-serif"],
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
