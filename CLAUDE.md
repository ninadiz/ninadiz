# CLAUDE.md

Developer notes for ninadiz.tech, the personal product design portfolio (a career timeline plus long-form case studies). Content is authored in Markdown/YAML files; there is no backend or CMS.

Content authoring guides:

- [Home page timeline](docs/timeline.md)
- [Case studies, including how to add a new one](docs/cases.md)

## Tech stack

| Area | Tool |
|---|---|
| UI | React 18 |
| Build / dev server | Vite 5 (`@vitejs/plugin-react`) |
| Routing | React Router 7 (`BrowserRouter`) |
| Case rendering | `react-markdown` + `rehype-raw` (Markdown with inline HTML) |
| Content parsing | `js-yaml` (frontmatter and timeline) |
| Interactive diagrams | `@xyflow/react`, `lucide-react` |
| Dev-only feedback tool | `agentation` (rendered only when `import.meta.env.DEV`) |
| Analytics | Google Analytics (gtag snippet in `index.html`, SPA page views sent from `src/App.jsx`) |

Plain CSS, one file per component, driven by design tokens in `src/styles/tokens.css`. No CSS framework.

## Quick start

Requires Node.js 18+ (developed on Node 24) and npm.

```bash
npm install
```

```bash
npm run dev
```

The dev server runs at http://localhost:5173. The port is strict (it fails instead of picking another one); override it with `PORT=3000 npm run dev`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | `vite build`, then `node scripts/prerender-meta.mjs` (see [Build and deploy](#build-and-deploy)) |
| `npm run preview` | Serves the production build from `dist/` at http://localhost:4173 |

## Build and deploy

`npm run build` produces a static site in `dist/` (git-ignored). It is a single-page app, so the build has two steps:

1. `vite build`: bundles the app into `dist/` with a single `index.html`.
2. `scripts/prerender-meta.mjs`: for every folder in `src/cases/`, writes `dist/cases/<slug>/index.html`, a copy of `dist/index.html` with that case's `<title>`, description, canonical URL and Open Graph/Twitter tags. This lets link previews (Slack, Telegram, LinkedIn…) show the right title, description and image, because crawlers do not run JavaScript. The preview image is the first image in the case body; if there is none, it falls back to `public/og-image.png`.

Hosting: the repo has no deploy configuration (no CI, `vercel.json`, `netlify.toml` or `CNAME`), so deploys are done outside the repo. Any static host works. Configure it to:

- run `npm run build` and serve `dist/`;
- fall back to `index.html` for unknown paths, so direct visits to `/portfolio` and `/contact` work. Case pages have their own prerendered `index.html`, so they work without the fallback.

## Project structure

```
index.html                Page template: default meta/OG tags, favicons, analytics
public/                   Static files served as-is: favicons, og-image.png
docs/                     Content authoring guides (timeline, cases)
scripts/
  prerender-meta.mjs      Post-build step: per-case HTML with correct meta tags
src/
  main.jsx                Entry point: BrowserRouter + global styles
  App.jsx                 Layout (header, footer), routes, page-view tracking
  pages/                  One component per route
    Home.jsx                Renders the timeline
    Portfolio.jsx           Stub (title only)
    Contact.jsx             Contact details (email, Telegram)
    CaseStudy.jsx           Renders a case from Markdown
  components/             UI components, each with its own .css
  cases/<slug>/           One folder per case study: index.md + its images/files
  timeline/timeline.md    Content of the home page timeline (YAML frontmatter)
  img/                    Media used by timeline items (gif, mp4…)
  data/socialLinks.js     Footer social links
  lib/
    cases.js                Loads and parses all cases at build time
    timeline.js             Loads the timeline and resolves its image paths
    embeds.js               Registry of React components usable inside cases
  styles/
    tokens.css              Design tokens (colors, type scale, spacing, layout)
    global.css              Resets and base styles
```

## Routing

Defined in `src/App.jsx`:

| Route | Page |
|---|---|
| `/` | `Home`: the timeline |
| `/portfolio` | `Portfolio`: currently an empty stub |
| `/contact` | `Contact` |
| `/cases/:caseName` | `CaseStudy`: `:caseName` is the case folder name |

An unknown `:caseName` renders "Case not found." There is no catch-all 404 route.

## Where content lives

| Content | Location |
|---|---|
| Timeline entries on the home page | `src/timeline/timeline.md` |
| Case studies | `src/cases/<slug>/index.md` |
| Case images, videos, downloadable files | next to the case's `index.md` |
| Timeline images and videos | `src/img/` (or a case folder) |
| Footer social links | `src/data/socialLinks.js` |
| Contact page text | `src/pages/Contact.jsx` |
| Default meta tags, analytics ID | `index.html` |
| Colors, type scale, spacing | `src/styles/tokens.css` |

## Known limitations

- `Portfolio` (`/portfolio`) is an empty stub and is not linked from the UI.
- `vuaerizm` is a placeholder case (lorem ipsum) and is not linked from the timeline.
- Case asset lookup is by filename, so duplicate filenames in different subfolders of one case collide (details in [docs/cases.md](docs/cases.md#how-assets-are-resolved)).
- The git remote uses SSH (`git@github.com:ninadiz/ninadiz.git`). The repo is named like the GitHub account, so this README is also the GitHub profile page.
