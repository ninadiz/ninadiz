# CLAUDE.md

Developer notes for ninadiz.tech, the personal product design portfolio (a career timeline plus long-form case studies). Content is authored in Markdown/YAML files; there is no backend or CMS.

Content authoring guides:

- [Home page](content/home/README.md)
- [Experience page timeline](content/timeline/README.md)
- [Case studies, including how to add a new one](content/cases/cases.md)

## Tech stack

| Area | Tool |
|---|---|
| UI | React 18 |
| Build / dev server | Vite 5 (`@vitejs/plugin-react`) |
| Routing | React Router 7 (`BrowserRouter`) |
| Case rendering | `react-markdown` + `rehype-raw` (Markdown with inline HTML) |
| Content parsing | `js-yaml` (frontmatter and timeline) |
| Interactive diagrams | `@xyflow/react`, `lucide-react` |
| Smooth scroll, scroll effects | `@fiddle-digital/string-tune` (`src/lib/stringTune.js`) |
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
| `npm run build` | `vite build`, then `node metatags/prerender-meta.mjs` (see [Build and deploy](#build-and-deploy)) |
| `npm run preview` | Serves the production build from `dist/` at http://localhost:4173 |

## Build and deploy

`npm run build` produces a static site in `dist/` (git-ignored). It is a single-page app, so the build has two steps:

1. `vite build`: bundles the app into `dist/` with a single `index.html`.
2. `metatags/prerender-meta.mjs`: for every folder in `content/cases/`, writes `dist/cases/<slug>/index.html`, a copy of `dist/index.html` with that case's `<title>`, description, canonical URL and Open Graph/Twitter tags. This lets link previews (Slack, Telegram, LinkedIn…) show the right title, description and image, because crawlers do not run JavaScript. The preview image is the first image in the case body; if there is none, it falls back to `metatags/og-image.png`.

Deploy: every push to `main` is built and uploaded by GitHub Actions (`.github/workflows/deploy.yml`). How it works, the required secrets and the server requirements are in [DEPLOY.md](DEPLOY.md). Any static host works if it:

- serves `dist/`;
- falls back to `index.html` for unknown paths, so direct visits to `/portfolio`, `/skills`, `/cases` and `/experience` work. Case pages have their own prerendered `index.html`, so they work without the fallback.

## Project structure

```
index.html                Page template: default meta/OG tags, favicons, analytics
SETUP.md                  How to run your own copy of this portfolio
DEPLOY.md                 How the site is built and deployed (no hosting details)
.htaccess                 Apache fallback to index.html, copied to dist/ by vite.config.js
plan/                     Working plans
content/                  All site content
  home/                     Home page
    home.md                   Home page content: intro, case cards, contact (YAML frontmatter)
    README.md                 How the home page works
    src/                      Home page media: avatar, one folder per case card
  cases/                    Case studies
    cases.md                  How to write and add a case
    <slug>/                   One folder per case: index.md + src/ (its images/files)
  timeline/                 Experience page timeline
    timeline.md               Timeline content (YAML frontmatter)
    README.md                 How the timeline works
    src/                      Media used by timeline items (gif, mp4…)
fav/                      Favicons, served from the site root
metatags/                 Link-preview assets and tooling
  og-image.png              Default share image, served from the site root
  prerender-meta.mjs        Post-build step: per-case HTML with correct meta tags
vite.config.js            Also serves/copies .htaccess and fav/, metatags/ images to the root
src/
  main.jsx                Entry point: BrowserRouter + global styles
  App.jsx                 Layout (header, footer), routes, page-view tracking
  pages/                  One component per route
    Home.jsx                Renders the card lane from home.md
    Portfolio.jsx           Stub (title only)
    Experience.jsx          Renders the timeline
    Cases.jsx               List of all case studies
    Skills.jsx              Stub (title only)
    CaseStudy.jsx           Renders a case from Markdown
  components/             UI components, each with its own .css
  data/socialLinks.js     Footer social links
  lib/
    cases.js                Loads and parses all cases at build time
    home.js                 Loads the home page content and resolves its media
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
| `/` | `Home`: the hero |
| `/portfolio` | `Portfolio`: currently an empty stub |
| `/skills` | `Skills`: currently an empty stub |
| `/experience` | `Experience`: the timeline |
| `/cases` | `Cases`: list of all case studies |
| `/cases/:caseName` | `CaseStudy`: `:caseName` is the case folder name |

An unknown `:caseName` renders "Case not found." There is no catch-all 404 route.

## Where content lives

| Content | Location |
|---|---|
| Home page: intro, case cards, contact | `content/home/home.md` |
| Home page media (avatar, case card videos) | `content/home/src/` |
| Timeline entries on the Experience page | `content/timeline/timeline.md` |
| Case studies | `content/cases/<slug>/index.md` |
| Case images, videos, downloadable files | `content/cases/<slug>/src/` |
| Timeline images and videos | `content/timeline/src/` (or a case folder) |
| Footer social links | `src/data/socialLinks.js` |
| Default meta tags, analytics ID | `index.html` |
| Favicons / default share image | `fav/` / `metatags/og-image.png` |
| Colors, type scale, spacing | `src/styles/tokens.css` |

## Known limitations

- `Portfolio` (`/portfolio`) is an empty stub and is not linked from the UI.
- `vuaerizm` is a placeholder case (lorem ipsum), hidden from the `/cases` list (`hidden: true` in its frontmatter) and not linked from the timeline.
- Case asset lookup is by filename, so duplicate filenames in different subfolders of one case collide (details in [cases/cases.md](content/cases/cases.md#how-assets-are-resolved)).
- The git remote uses SSH (`git@github.com:ninadiz/ninadiz.git`). The repo is named like the GitHub account, so this README is also the GitHub profile page.
