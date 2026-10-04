import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, "dist");
const CASES_DIR = join(ROOT, "src/cases");
const SITE_URL = "https://ninadiz.tech";
const DEFAULT_DESCRIPTION =
  "Ninadiz designs human experiences — product design portfolio and case studies.";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toPlainText(markdown) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function parseCase(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { title: "", description: "", content: raw };
  const [, frontmatter, content] = match;
  const data = load(frontmatter) ?? {};
  return {
    title: data.title ?? "",
    description: data.description ?? "",
    content,
  };
}

function findHeroAssetUrl(content) {
  const imageMatch = content.match(/!\[[^\]]*\]\(([^)\s"]+)/);
  if (!imageMatch) return null;
  const basename = imageMatch[1].split("/").pop();
  const stem = basename.replace(/\.[^.]+$/, "");
  const assetsDir = join(DIST, "assets");
  if (!existsSync(assetsDir)) return null;
  const found = readdirSync(assetsDir).find((file) => file.startsWith(`${stem}-`));
  return found ? `${SITE_URL}/assets/${found}` : null;
}

function renderPage(template, { title, description, url, image, hasCustomImage }) {
  let html = template;
  const fullTitle = escapeHtml(`${title} — Ninadiz`);
  const safeDescription = escapeHtml(description);

  html = html.replace(/<title>.*?<\/title>/, `<title>${fullTitle}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${safeDescription}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${fullTitle}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${safeDescription}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${image}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${fullTitle}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${safeDescription}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${image}" />`
  );

  if (hasCustomImage) {
    html = html.replace(/\s*<meta property="og:image:width" content="[^"]*"\s*\/>\n/, "\n");
    html = html.replace(/\s*<meta property="og:image:height" content="[^"]*"\s*\/>\n/, "\n");
  }

  return html;
}

function main() {
  const templatePath = join(DIST, "index.html");
  if (!existsSync(templatePath)) {
    console.error("dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }
  const template = readFileSync(templatePath, "utf8");

  const slugs = readdirSync(CASES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const slug of slugs) {
    const mdPath = join(CASES_DIR, slug, "index.md");
    if (!existsSync(mdPath)) continue;
    const raw = readFileSync(mdPath, "utf8");
    const { title, description, content } = parseCase(raw);

    const plainDescription = description
      ? truncate(toPlainText(description), 200)
      : DEFAULT_DESCRIPTION;
    const heroImage = findHeroAssetUrl(content);

    const html = renderPage(template, {
      title: title || slug,
      description: plainDescription,
      url: `${SITE_URL}/cases/${slug}`,
      image: heroImage ?? `${SITE_URL}/og-image.png`,
      hasCustomImage: Boolean(heroImage),
    });

    const outDir = join(DIST, "cases", slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), html);
    console.log(`Prerendered meta for /cases/${slug}`);
  }
}

main();
