import { blogPosts, essays } from "@/lib/content";

const site = "https://www.cangshudiudiu.com";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = [...blogPosts, ...essays]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
    .map((entry) => {
      const url = new URL(entry.url, site).toString();
      return `<item>
  <title>${escapeXml(entry.title)}</title>
  <description>${escapeXml(entry.description)}</description>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
</item>`;
    })
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>cangshuzhijia</title>
  <description>博客和随笔动态更新</description>
  <link>${site}</link>
  ${items}
</channel>
</rss>`, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
