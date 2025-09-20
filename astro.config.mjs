// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://basketballvideoanalyzer.com",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.cjs",
    }),
    react(),
    sitemap(),
  ],
  vite: {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
  },
});
