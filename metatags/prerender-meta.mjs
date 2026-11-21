import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, "dist");
const CASES_DIR = join(ROOT, "content/cases");
const SITE_URL = "https://ninadiz.tech";
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
  const files = readdirSync(assetsDir);
  // A video cannot be a link preview: use its poster (<name>.poster.<ext>) if there is one.
  const isVideo = /\.(mp4|webm|mov)$/i.test(basename);
  const found = isVideo
    ? files.find((file) => file.startsWith(`${stem}.poster-`))
    : files.find((file) => file.startsWith(`${stem}-`));
  return found ? `${SITE_URL}/assets/${found}` : null;
}

function renderPage(template, { title, description, url, image, hasCustomImage }) {
  let html = template;
  const fullTitle = escapeHtml(title);
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

  const dictionaries = Object.fromEntries(["en", "ru"].map((lang) => [
    lang, JSON.parse(readFileSync(join(ROOT, "app/i18n", lang + ".json"), "utf8")),
  ]));
  const keys = (dict) => Object.keys(dict).sort().join("|");
  if (keys(dictionaries.en) !== keys(dictionaries.ru)) throw new Error("UI dictionary keys differ");

  for (const lang of ["en", "ru"]) {
    const localizedTemplate = lang === "en"
      ? template.replace(/(<link\b[^>]*rel="preload"[^>]*href=")[^"]*inter-latin-opsz-normal-[^"]+/, "$1/fonts/uncut-sans/UncutSans-Variable.woff2")
      : template;
    const messages = dictionaries[lang];
    const prefix = lang === "ru" ? "/ru" : "";
    const pages = ["", "cases", "experience", "portfolio", "skills"].map((route) => ({
      route, title: route ? messages[route] : "", translated: true,
    }));
    for (const slug of slugs) {
      const dir = join(CASES_DIR, slug);
      const file = join(dir, lang === "ru" ? "index.ru.md" : "index.md");
      if (!existsSync(file) || !existsSync(join(dir, "index.md"))) continue;
      const data = parseCase(readFileSync(file, "utf8"));
      pages.push({ ...data, route: "cases/" + slug, translated: existsSync(join(dir, "index.ru.md")) });
    }
    for (const page of pages) {
      const path = "/" + page.route;
      const url = SITE_URL + prefix + path;
      const image = findHeroAssetUrl(page.content ?? "");
      const html = renderPage(localizedTemplate, {
        title: page.title ? page.title + " — " + messages.siteName : messages.siteTitle,
        description: page.description ? truncate(toPlainText(page.description), 200) : messages.siteDescription,
        url, image: image ?? SITE_URL + "/og-image.png", hasCustomImage: !!image,
      }).replace(/<html lang="[^"]+">/, `<html lang="${lang}">`);
      const alternates = page.translated ? ["en", "ru"].map((language) =>
        `<link rel="alternate" hreflang="${language}" href="${SITE_URL}${language === "ru" ? "/ru" : ""}${path}" />`
      ).join("\n    ") : "";
      const dir = join(DIST, prefix, path);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), html.replace("</head>", alternates + "\n  </head>"));
    }
  }
}

main();
