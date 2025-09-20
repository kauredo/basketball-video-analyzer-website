/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Basketball-themed color palette
        primary: {
          50: "#FFF4ED",
          100: "#FFE6D5",
          200: "#FFD0AA",
          300: "#FFB274",
          400: "#FF8A5C",
          500: "#FF6B35", // Main brand color
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
        neutral: {
          950: "#0A0A0A",
        },
      },
      fontFamily: {
        display: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
        body: ["Inter", "SF Pro Text", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s infinite",
        "bounce-gentle": "bounce 2s infinite",
        "hover-lift": "hover-lift 0.2s ease-out",
      },
      keyframes: {
        "hover-lift": {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-4px)" },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      backgroundImage: {
        "court-pattern": `linear-gradient(90deg, #FFFFFF 1px, transparent 1px),
                         linear-gradient(#FFFFFF 1px, transparent 1px)`,
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        court: "50px 50px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
