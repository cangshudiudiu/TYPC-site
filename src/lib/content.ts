type Module = {
  frontmatter: {
    title: string;
    description: string;
    date: string;
    status?: "published" | "archived";
    featured?: boolean;
    cover?: string;
    language?: "zh" | "en";
    tags?: string[];
    externalUrl?: string;
    fileUrl?: string;
  };
  url?: string;
  file: string;
};

export type Entry = Module["frontmatter"] & {
  slug: string;
  url: string;
  section: string;
  sectionLabel: string;
};

const blogModules = import.meta.glob<Module>("../content/blog/*.md", { eager: true });
const essayModules = import.meta.glob<Module>("../content/essays/*.md", { eager: true });
const resourceModules = import.meta.glob<Module>("../content/resources/*.md", { eager: true });
const bookmarkModules = import.meta.glob<Module>("../content/bookmarks/*.md", { eager: true });
const downloadModules = import.meta.glob<Module>("../content/downloads/*.md", { eager: true });

const sectionLabels: Record<string, string> = {
  blog: "博客",
  essays: "动态",
  resources: "资料",
  bookmarks: "收藏",
  downloads: "下载"
};

function toEntries(modules: Record<string, Module>, base: string): Entry[] {
  return Object.entries(modules)
    .filter(([, mod]) => (mod.frontmatter.status ?? "published") === "published")
    .map(([path, mod]) => {
      const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";
      return {
        ...mod.frontmatter,
        slug,
        section: base,
        sectionLabel: sectionLabels[base] ?? base,
        url: mod.frontmatter.externalUrl ?? mod.frontmatter.fileUrl ?? `/${base}/${slug}/`
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const blogPosts = toEntries(blogModules, "blog");
export const essays = toEntries(essayModules, "essays");
export const resources = toEntries(resourceModules, "resources");
export const bookmarks = toEntries(bookmarkModules, "bookmarks");
export const downloads = toEntries(downloadModules, "downloads");

export const latestEntries = [...blogPosts, ...essays, ...resources, ...bookmarks, ...downloads]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6);

export const featuredEntries = [...blogPosts, ...essays, ...resources, ...bookmarks, ...downloads]
  .filter((entry) => entry.featured)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

export const allTags = Array.from(
  new Set([...blogPosts, ...essays, ...resources, ...bookmarks, ...downloads].flatMap((entry) => entry.tags ?? []))
).sort((a, b) => a.localeCompare(b, "zh-CN"));

export const entriesByTag = allTags.map((tag) => ({
  tag,
  entries: [...blogPosts, ...essays, ...resources, ...bookmarks, ...downloads]
    .filter((entry) => entry.tags?.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}));
