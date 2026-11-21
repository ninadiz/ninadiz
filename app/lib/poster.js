// A video can have a still placeholder next to it: same file name with
// ".poster.<ext>" instead of the video extension, e.g.
// refilling-slider.mp4 -> refilling-slider.poster.webp
const POSTER_EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

export function posterNamesFor(videoPath) {
  if (!videoPath) return [];
  const base = videoPath.replace(/\.[^./]+$/, "");
  return POSTER_EXTENSIONS.map((ext) => `${base}.poster.${ext}`);
}

// Returns the URL of the first poster `lookup` can resolve, or undefined.
export function findPoster(videoPath, lookup) {
  for (const name of posterNamesFor(videoPath)) {
    const url = lookup(name);
    if (url) return url;
  }
  return undefined;
}
