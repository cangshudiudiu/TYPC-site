import type { Entry } from "./content";

type Module = {
  frontmatter: Omit<Entry, "slug" | "url" | "section" | "sectionLabel">;
  url?: string;
  file: string;
};

const blogModules = import.meta.glob<Module>("../content-en/blog/*.md", { eager: true });
const researchModules = import.meta.glob<Module>("../content-en/research/*.md", { eager: true });
const essayModules = import.meta.glob<Module>("../content-en/essays/*.md", { eager: true });
const resourceModules = import.meta.glob<Module>("../content-en/resources/*.md", { eager: true });
const bookmarkModules = import.meta.glob<Module>("../content-en/bookmarks/*.md", { eager: true });
const downloadModules = import.meta.glob<Module>("../content-en/downloads/*.md", { eager: true });

const sectionLabels: Record<string, string> = {
  research: "Research",
  blog: "Blog",
  essays: "Notes",
  resources: "Resources",
  bookmarks: "Bookmarks",
  downloads: "Downloads"
};

const internalSections = new Set(["research", "blog", "essays", "resources"]);

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
        url: internalSections.has(base) || (!mod.frontmatter.externalUrl && !mod.frontmatter.fileUrl)
          ? `/en/${base}/${slug}/`
          : (mod.frontmatter.externalUrl ?? mod.frontmatter.fileUrl ?? `/en/${base}/${slug}/`)
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const researchEn = toEntries(researchModules, "research");
export const blogPostsEn = toEntries(blogModules, "blog");
export const essaysEn = toEntries(essayModules, "essays");
export const resourcesEn = toEntries(resourceModules, "resources");
export const bookmarksEn = toEntries(bookmarkModules, "bookmarks");
export const downloadsEn = toEntries(downloadModules, "downloads");
export const allEntriesEn = [...researchEn, ...blogPostsEn, ...essaysEn, ...resourcesEn, ...bookmarksEn, ...downloadsEn]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
export const latestEntriesEn = allEntriesEn.slice(0, 6);
