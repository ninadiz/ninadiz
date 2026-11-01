import { load } from "js-yaml";

const timelineModules = import.meta.glob("/content/timeline/timeline.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const imageModules = import.meta.glob(
  "/content/timeline/src/*.{png,jpg,jpeg,gif,svg,webp,mp4,webm,mov}",
  { eager: true, query: "?url", import: "default" }
);

const imagesByFilename = {};
for (const [path, url] of Object.entries(imageModules)) {
  imagesByFilename[path.split("/").at(-1)] = url;
}

const caseImageModules = import.meta.glob(
  "/content/cases/*/*.{png,jpg,jpeg,gif,svg,webp,mp4,webm,mov}",
  { eager: true, query: "?url", import: "default" }
);

const caseImagesByRelativePath = {};
for (const [path, url] of Object.entries(caseImageModules)) {
  caseImagesByRelativePath[path.replace("/content/cases/", "cases/")] = url;
}

function resolveImage(image) {
  if (!image) return image;
  if (image.startsWith("cases/")) {
    return caseImagesByRelativePath[image] ?? image;
  }
  return imagesByFilename[image] ?? image;
}

const [source] = Object.values(timelineModules);
const frontmatterMatch = source?.match(/^---\n([\s\S]*?)\n---/);
const data = frontmatterMatch ? load(frontmatterMatch[1]) : {};

export const timelineItems = (data.items ?? []).map((item) => ({
  ...item,
  image: resolveImage(item.image),
}));
