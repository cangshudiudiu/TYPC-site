import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.cangshudiudiu.com",
  integrations: [sitemap({
    filter: (page) => !["/guestbook/", "/submit/", "/review/"].some((path) => page.endsWith(path))
  })],
  devToolbar: {
    enabled: false
  },
  vite: {
    optimizeDeps: {
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
