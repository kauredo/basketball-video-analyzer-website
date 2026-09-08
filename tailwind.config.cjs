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
        // Scorebook paper. The names are the old scale's so the ~230 class
        // usages did not have to move; the values are the direction's, and the
        // job each one does is named here because a number does not say it.
        //
        // The scale was near-white before: warm-50 was #FDFBF7, which is 99%
        // white, and the two band grounds differed by 1.05:1. That is what
        // "so much white" was. Paper is a colour, not the absence of one.
        warm: {
          50: "#F6F2EA", // paper. The page ground.
          100: "#EDE7DB", // paper-2. The alternate band. 1.10:1 against paper.
          200: "#E5DFD1", // fills that are not functional: stripes, inline code.
          300: "#DED5C4", // rule. The hairline on every band edge.
          400: "#BFB39C", // rule-2. Second weight, and the court line work.
          500: "#A39880", // between the rule and the micro-label. Non-text only.
          600: "#8B8272", // tx-3, micro-labels. 3.40:1 on paper: NOT body copy.
          700: "#5C5648", // tx-2. Body and secondary copy, 6.53:1 on paper.
          800: "#3B372E", // between the body ink and the headline.
          900: "#1B1813", // tx. Headline and primary ink, 15.85:1 on paper.
          950: "#100E0B", // the deepest ink. Reserved.
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
