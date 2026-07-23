const markdownModules = import.meta.glob("/src/cases/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const assetModules = import.meta.glob(
  "/src/cases/*/*.{png,jpg,jpeg,gif,svg,webp}",
  { eager: true, query: "?url", import: "default" }
);

function slugFromPath(path) {
  return path.split("/").at(-2);
}

const assetsBySlug = {};
for (const [path, url] of Object.entries(assetModules)) {
  const slug = slugFromPath(path);
  const filename = path.split("/").at(-1);
  assetsBySlug[slug] ??= {};
  assetsBySlug[slug][filename] = url;
}

export const cases = Object.fromEntries(
  Object.entries(markdownModules).map(([path, markdown]) => {
    const slug = slugFromPath(path);
    return [slug, { slug, markdown, assets: assetsBySlug[slug] ?? {} }];
  })
);

export function getCase(slug) {
  return cases[slug];
}
