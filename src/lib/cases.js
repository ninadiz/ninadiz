import { load } from "js-yaml";
import { findPoster } from "./poster.js";

const VIDEO_RE = /\.(mp4|webm|mov)$/i;

const markdownModules = import.meta.glob("/content/cases/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const assetModules = import.meta.glob(
  "/content/cases/*/**/*.{png,jpg,jpeg,gif,svg,webp,mp4,webm,mov,pdf,docx}",
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
      hidden: false,
      focus: [],
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
    hidden: data.hidden === true,
    // "ux" and/or "ui": which Cases filter shows the case; empty = every filter
    focus: [].concat(data.focus ?? []).map((f) => String(f).toLowerCase()),
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

// The cover is the first image in the case body, the same rule the build uses
// for link previews (metatags/prerender-meta.mjs). Covers are shown as <img>,
// so when that first image is a video its poster is used instead.
export function coverOf(caseData) {
  const src = caseData.content.match(/!\[[^\]]*\]\(([^)\s]+)/)?.[1];
  if (!src) return null;
  const filename = src.split("/").pop();
  if (VIDEO_RE.test(filename)) {
    return findPoster(filename, (name) => caseData.assets[name]) ?? null;
  }
  return caseData.assets[src] ?? caseData.assets[filename] ?? null;
}
