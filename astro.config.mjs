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
    sitemap({
      filter: (page) => !page.includes('/CLAUDE'),
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
