import { load } from "js-yaml";

const markdownModules = import.meta.glob("/src/cases/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const assetModules = import.meta.glob(
  "/src/cases/*/**/*.{png,jpg,jpeg,gif,svg,webp,mp4,webm,mov,pdf,docx}",
  { eager: true, query: "?url", import: "default" }
);

function slugFromPath(path) {
  const parts = path.split("/");
  return parts[parts.indexOf("cases") + 1];
}

const assetsBySlug = {};
for (const [path, url] of Object.entries(assetModules)) {
  const slug = slugFromPath(path);
  const filename = path.split("/").at(-1);
  assetsBySlug[slug] ??= {};
  assetsBySlug[slug][filename] = url;
}

function parseCase(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return {
      date: "",
      title: "",
      tags: [],
      description: "",
      client: "",
      clientLogo: "",
      clientDescription: "",
      content: raw,
    };
  }
  const [, frontmatter, content] = match;
  const data = load(frontmatter) ?? {};
  return {
    date: data.date ?? "",
    title: data.title ?? "",
    tags: data.tags ?? [],
    description: data.description ?? "",
    client: data.client ?? "",
    clientLogo: data.clientLogo ?? "",
    clientDescription: data.clientDescription ?? "",
    content: content.trim(),
  };
}

export const cases = Object.fromEntries(
  Object.entries(markdownModules).map(([path, raw]) => {
    const slug = slugFromPath(path);
    return [
      slug,
      { slug, ...parseCase(raw), assets: assetsBySlug[slug] ?? {} },
    ];
  })
);

export function getCase(slug) {
  return cases[slug];
}
