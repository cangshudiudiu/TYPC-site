import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.cangshudiudiu.com",
  integrations: [sitemap()],
  devToolbar: {
    enabled: false
  },
  vite: {
    optimizeDeps: {
      disabled: true,
      noDiscovery: true,
      include: [],
      exclude: ["astro > aria-query", "astro > axobject-query"]
    }
  },

  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
