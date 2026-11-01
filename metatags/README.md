# Meta tags

Everything for link previews and search snippets.

- `og-image.png`: the default share image (1200×630), served at `/og-image.png`.
- `prerender-meta.mjs`: post-build step (`npm run build`). For every folder in `content/cases/` it writes `dist/cases/<slug>/index.html` with that case's title, description, canonical URL and Open Graph/Twitter tags. Site domain, default description and the title suffix are constants at the top of the script.
- The default tags for all other pages live in the root `index.html`.
