import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ROOT = dirname(fileURLToPath(import.meta.url));

// Folders whose images are served from the site root (/favicon.ico,
// /og-image.png…), in dev and in the build.
const ROOT_ASSET_DIRS = ["fav", "metatags"];
const ROOT_ASSET_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// Apache fallback to index.html for direct visits to /experience etc.
const ROOT_FILES = [join(ROOT, ".htaccess")];

function rootAssetFiles() {
  return ROOT_FILES.concat(ROOT_ASSET_DIRS.flatMap((dir) =>
    readdirSync(join(ROOT, dir))
      .filter((file) => extname(file) in ROOT_ASSET_TYPES)
      .map((file) => join(ROOT, dir, file))
  ));
}

function rootAssets() {
  return {
    name: "root-assets",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url.split("?")[0].slice(1);
        const file = rootAssetFiles().find((path) => basename(path) === name);
        if (!file) return next();
        res.setHeader("Content-Type", ROOT_ASSET_TYPES[extname(file)] ?? "text/plain");
        res.end(readFileSync(file));
      });
    },
    generateBundle() {
      for (const file of rootAssetFiles()) {
        this.emitFile({
          type: "asset",
          fileName: basename(file),
          source: readFileSync(file),
        });
      }
    },
  };
}

// Preload the latin Inter file (the self-hosted font, see src/main.jsx) so
// the browser fetches it together with the CSS instead of after it: the
// home headline waits for the font before it slides in.
function preloadFont() {
  return {
    name: "preload-font",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const file = Object.keys(ctx.bundle ?? {}).find((name) =>
          /inter-latin-wght-normal-[^/]*\.woff2$/.test(name)
        );
        if (!file) return html;
        return [
          {
            tag: "link",
            attrs: { rel: "preload", href: `/${file}`, as: "font", type: "font/woff2", crossorigin: "" },
            injectTo: "head-prepend",
          },
        ];
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), rootAssets(), preloadFont()],
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        // React and the router change rarely: a chunk of their own stays
        // cached in the browser when only the site's code or content changes.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return "react";
          }
        },
      },
    },
  },
});
