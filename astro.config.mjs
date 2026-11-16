// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { pageDates } from "./src/data/pageDates.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://basketballvideoanalyzer.com",
  trailingSlash: "always",
  redirects: {
    "/download": "/",
    "/pricing": "/",
  },
  integrations: [
    tailwind({
      configFile: "./tailwind.config.cjs",
    }),
    react(),
    sitemap({
      serialize(item) {
        const dates = pageDates[new URL(item.url).pathname];
        if (dates) item.lastmod = dates.modified;
        return item;
      },
    }),
  ],
  build: {
    // Enable CSS and JS minification
    inlineStylesheets: "auto",
  },
  compressHTML: true,
  vite: {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Rollup options for better tree shaking
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  },
});
