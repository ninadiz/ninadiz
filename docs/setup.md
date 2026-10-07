# Run your own copy of this portfolio

This guide takes you from zero to a working copy of the site on your machine, and then shows what to change so it becomes yours.

## 1. Prerequisites

- [Node.js](https://nodejs.org) 18 or newer (the site is developed on Node 24)
- npm (comes with Node.js)
- Git

## 2. Get the code

Fork the repository on GitHub, or just clone it:

```bash
git clone https://github.com/ninadiz/ninadiz.git my-portfolio
cd my-portfolio
```

## 3. Install and run

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. The page reloads automatically when you save a file.

If the port is busy, run on another one: `PORT=3000 npm run dev`.

## 4. Make it yours

The site is content-driven, so most of the work is editing text files. Go through this checklist. Everything below still contains the original author's data.

| What | Where |
|---|---|
| Home page timeline: your career, your buttons | `src/timeline/timeline.md` (see [timeline guide](timeline.md)) |
| Case studies: delete the existing ones, add yours | `src/cases/` (see [case study guide](cases.md)) |
| Timeline media of the original author | `src/img/` (remove files you do not use) |
| Header name and tagline | `src/components/Header.jsx` |
| Contact page: email, messenger | `src/pages/Contact.jsx` |
| Footer social links | `src/data/socialLinks.js` |
| Page title, description, canonical URL, Open Graph and Twitter tags | `index.html` |
| Domain and default description used for per-case link previews | `scripts/prerender-meta.mjs` (`SITE_URL`, `DEFAULT_DESCRIPTION`, and the `— Ninadiz` title suffix) |
| Favicons and the default share image | `public/` (`favicon.*`, `apple-touch-icon.png`, `og-image.png`, 1200×630) |
| Colors, fonts, spacing | `src/styles/tokens.css` |

### Analytics

`index.html` contains a Google Analytics ID that belongs to the original author. **Replace it with your own ID, or remove the whole gtag snippet**, otherwise your visits will be counted in someone else's statistics. The page-view code in `src/App.jsx` does nothing when `gtag` is absent, so removing the snippet is safe.

### Interactive diagrams

The two diagrams used inside the existing cases (`DesignerNetworkDiagram`, `RefillingProcessFlow`) are specific to the original content. If you delete those cases, you can also delete the components and their entries in `src/lib/embeds.js`.

## 5. Build

```bash
npm run build
```

This creates the static site in `dist/`: the app itself plus one prerendered `index.html` per case with its own title, description and share image for link previews. To look at the production build locally:

```bash
npm run preview
```

It opens at http://localhost:4173.

## 6. Publish

`dist/` is a plain static site, so any static host will do (Vercel, Netlify, Cloudflare Pages, GitHub Pages, your own server). Set up the host to:

- run `npm run build` and serve the `dist/` folder;
- send unknown paths to `index.html` (a "single-page app" or "SPA fallback" setting), so direct visits to `/contact` and `/portfolio` work.

Then point your domain at the host and update the domain in `index.html` and `scripts/prerender-meta.mjs` (see the checklist above).

## Troubleshooting

| Problem | Fix |
|---|---|
| `Port 5173 is already in use` | The dev server does not switch ports on its own. Stop the other process or use `PORT=3000 npm run dev` |
| An image in a case shows a placeholder | The filename or path in `index.md` does not match a file in the case folder (see [assets](cases.md#how-assets-are-resolved)) |
| Link previews show the wrong title or image | Previews are generated only by `npm run build`, not in dev mode. Check the case's frontmatter and its first image |
| `dist/index.html not found` during build | `vite build` failed before the prerender step. Scroll up for the first error |
