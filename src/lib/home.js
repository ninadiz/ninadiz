import { load } from "js-yaml";
import { cases, coverOf } from "./cases.js";
import { findPoster } from "./poster.js";

// Home page content: content/home/home.md (YAML frontmatter only) and its
// media in content/home/src/. Media paths in home.md are relative to src/,
// e.g. "avatar.jpg" or "refilling-ftue/home-card.webm".

const homeModules = import.meta.glob("/content/home/home.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const mediaModules = import.meta.glob(
  "/content/home/src/**/*.{png,jpg,jpeg,gif,svg,webp,mp4,webm,mov}",
  { eager: true, query: "?url", import: "default" }
);

const mediaByPath = {};
for (const [path, url] of Object.entries(mediaModules)) {
  mediaByPath[path.replace("/content/home/src/", "")] = url;
}

const lookup = (path) => mediaByPath[path];

// A dark card background ("#325CFF") gets white text, a light one ("#DCDCDC")
// keeps the dark text. Relative luminance of a #rgb or #rrggbb colour.
function isDark(color) {
  let hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color)?.[1];
  if (!hex) return false;
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.4;
}

const VIDEO_RE = /\.(mp4|webm|mov)$/i;

const [source] = Object.values(homeModules);
const frontmatterMatch = source?.match(/^---\n([\s\S]*?)\n---/);
const data = (frontmatterMatch ? load(frontmatterMatch[1]) : null) ?? {};

// A case card shows its media (a video or an image from content/home/src/),
// else the case cover. A transparent video is a .webm plus a .mov copy with
// the same name (HEVC with alpha) for Safari; a poster sits next to it.
function caseCard(entry) {
  const item = cases[entry.case];
  if (!item) return null;
  const media = entry.media || "";
  const isVideo = VIDEO_RE.test(media);
  const hevc = isVideo ? lookup(media.replace(/\.[^.]+$/, ".mov")) : undefined;
  const src = media ? lookup(media) : undefined;
  return {
    slug: item.slug,
    meta: [item.client, item.date].filter(Boolean).join(" · "),
    title: entry.title || item.title,
    color: entry.color || "",
    dark: isDark(entry.color || ""),
    hoverColor: entry.hoverColor || "",
    hoverDark: isDark(entry.hoverColor || ""),
    hoverMetaColor: entry.hoverMetaColor || "",
    video: isVideo ? src : undefined,
    hevcVideo: isVideo && hevc !== src ? hevc : undefined,
    poster: isVideo ? findPoster(media, lookup) : undefined,
    image: isVideo ? undefined : src ?? coverOf(item),
  };
}

const intro = data.intro ?? {};

export const home = {
  intro: {
    ...intro,
    avatar: intro.avatar ? lookup(intro.avatar) : undefined,
    links: intro.links ?? [],
    sectors: intro.sectors ?? [],
  },
  cases: (data.cases ?? []).map(caseCard).filter(Boolean),
  contact: { links: [], ...data.contact },
};
