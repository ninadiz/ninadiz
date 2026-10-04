# ninadiz.tech

Personal product design portfolio of Ninadiz — a career timeline plus long-form case studies. Live at [ninadiz.tech](https://ninadiz.tech).

![Site preview](public/og-image.png)

Content is authored in Markdown/YAML files; there is no backend or CMS.

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

1. `vite build` — bundles the app into `dist/` with a single `index.html`.
2. `scripts/prerender-meta.mjs` — for every folder in `src/cases/`, writes `dist/cases/<slug>/index.html`: a copy of `dist/index.html` with that case's `<title>`, description, canonical URL and Open Graph/Twitter tags. This lets link previews (Slack, Telegram, LinkedIn…) show the right title, description and image, because crawlers do not run JavaScript. The preview image is the first image in the case body; if there is none, it falls back to `public/og-image.png`.

Hosting: the repo has no deploy configuration (no CI, `vercel.json`, `netlify.toml` or `CNAME`), so deploys are done outside the repo. Any static host works. Configure it to:

- run `npm run build` and serve `dist/`;
- fall back to `index.html` for unknown paths, so direct visits to `/portfolio` and `/contact` work. Case pages have their own prerendered `index.html`, so they work without the fallback.

## Project structure

```
index.html                Page template: default meta/OG tags, favicons, analytics
public/                   Static files served as-is: favicons, og-image.png
scripts/
  prerender-meta.mjs      Post-build step: per-case HTML with correct meta tags
src/
  main.jsx                Entry point: BrowserRouter + global styles
  App.jsx                 Layout (banner, header, footer), routes, page-view tracking
  pages/                  One component per route
    Home.jsx                Renders the timeline
    Portfolio.jsx           Stub (title only)
    Contact.jsx             Contact details (email, Telegram)
    CaseStudy.jsx           Renders a case from Markdown (see below)
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
| `/` | `Home` — the timeline |
| `/portfolio` | `Portfolio` — currently an empty stub |
| `/contact` | `Contact` |
| `/cases/:caseName` | `CaseStudy` — `:caseName` is the case folder name |

An unknown `:caseName` renders "Case not found." There is no catch-all 404 route.

## Where content lives

| Content | Location |
|---|---|
| Timeline entries on the home page | `src/timeline/timeline.md` |
| Case studies | `src/cases/<slug>/index.md` |
| Case images, videos, downloadable files | next to the case's `index.md` |
| Timeline images and videos | `src/img/` (or a case folder, see below) |
| Footer social links | `src/data/socialLinks.js` |
| Contact page text | `src/pages/Contact.jsx` |
| Top announcement banner text | `src/components/AnnouncementBanner.jsx` |
| Default meta tags, analytics ID | `index.html` |
| Colors, type scale, spacing | `src/styles/tokens.css` |

### Timeline

`src/timeline/timeline.md` contains only YAML frontmatter with an `items` list, shown top to bottom (newest first). Each item:

```yaml
- date: |-
    July '26
    – February '19
  title: "HTML allowed here, e.g. <a href=\"…\">links</a>"   # rendered as HTML
  subheader: "Optional short paragraph"
  image: "enapter.mp4"             # file in src/img/, or "cases/<slug>/<file>"
  imageDescription: "Optional caption"
  buttonPrimary:                   # filled button; leave label empty to hide
    label: "Explore case study"
    href: "/cases/refilling-ftue"  # starting with "/" = in-app link
  buttonSecondary:                 # outlined button
    label: "Watch on Youtube"
    href: "https://…"
    newTab: true
```

Images and videos (`mp4`, `webm`, `mov`) are both supported and videos autoplay muted in a loop.

## Case studies

A case is a Markdown file with YAML frontmatter, rendered by `src/pages/CaseStudy.jsx`. The route and the folder are tied together: `src/cases/refilling-ftue/index.md` is served at `/cases/refilling-ftue`.

### How to add a new case

1. **Create the folder.** The folder name becomes the URL slug, so use lowercase kebab-case.

   ```bash
   mkdir src/cases/my-new-case
   ```

2. **Add the assets** (images, videos, PDFs, docx) into that folder, for example `src/cases/my-new-case/img/cover.jpg`. Supported types: `png jpg jpeg gif svg webp mp4 webm mov pdf docx`. Subfolders are fine.

3. **Create `src/cases/my-new-case/index.md`.** Start from this template. The `---` frontmatter block must be at the very first line of the file:

   ```markdown
   ---
   date: "2026"
   title: "One-sentence headline of the case, shown as the page title."
   tags: ["Product design", "B2B"]
   description: "Short intro under the title. Markdown and links allowed."
   client: "Company"
   clientLogo: "img/logo.svg"
   clientDescription: "One line about the client."
   ---

   {wide}
   ![Caption](img/cover.jpg)

   {h2} Where we started

   1. First point.
   2. Second point.

   {h2} What I did

   Paragraph text with a [link](https://example.com).
   ```

4. **Link it from the home page.** A case does **not** appear anywhere automatically: add (or edit) an item in `src/timeline/timeline.md` and point a button at the case:

   ```yaml
   buttonPrimary:
     label: "Explore case study"
     href: "/cases/my-new-case"
   ```

5. **Check it locally.** Run `npm run dev` and open `/cases/my-new-case`. A missing image shows a placeholder with its caption instead of failing, which is a sign the filename or path is wrong.

6. **Check the production build** (this is the step that generates link previews):

   ```bash
   npm run build
   ```

   The log should contain `Prerendered meta for /cases/my-new-case`. Optionally run `npm run preview` and open `http://localhost:4173/cases/my-new-case`.

7. **Commit and deploy** (see [Build and deploy](#build-and-deploy)).

### Frontmatter fields

| Field | Used for |
|---|---|
| `title` | Page heading, browser tab (`<title>` becomes "title — Ninadiz") and link previews |
| `description` | Intro under the heading (Markdown and inline HTML allowed). Also the meta description for link previews: plain text, cut to 200 characters. If empty, the site-wide default is used |
| `tags` | List of tags shown under the title |
| `client`, `clientLogo`, `clientDescription` | Client block. It is shown only when **both** `clientLogo` and `clientDescription` are set. `clientLogo` is a path inside the case folder |
| `date` | Parsed but not displayed on the page at the moment |

### Authoring syntax

Standard Markdown plus a few custom tags. Custom tags go on their own line.

| Syntax | Result |
|---|---|
| `{h2} Text` | Section heading. Each `{h2}` also starts a new section block with its own spacing, so use it to divide the case |
| `{title} Text` | Large `h1`-style heading inside the body (rarely needed: the title comes from frontmatter) |
| `{p} Text` | Plain paragraph (the tag is just stripped) |
| `{wide}` on the line above `![alt](file)` | Makes that one image full-width |
| `![caption](img/file.jpg)` | Image or video (video extensions autoplay muted in a loop). The alt text is shown as a caption |
| `{carousel}` … `{/carousel}` around several `![alt](file)` lines | Image carousel with arrows and dots |
| `![caption](embed/<key>)` | Interactive React component from `src/lib/embeds.js` (see below) |
| `[text](# "Explanation")` | Tooltip with the explanation. Any link with a title becomes a tooltip trigger |
| `[text](https://…)` | Regular link, opens in a new tab |
| `<a href="img/file.docx" title="button">Label</a>` | Download button (pill style). The href is resolved against the case's assets |
| Raw HTML | Allowed (`rehype-raw`); for example the `case-study__row` blocks in `refilling-ftue` for "Step Artifacts" rows |

### How assets are resolved

Paths in `index.md` (images, `clientLogo`, download buttons, carousel items) are matched against the files in the case folder, either by relative path (`img/cover.jpg`) or by bare filename (`cover.jpg`). Practical consequences:

- Use **unique filenames** within a case. Matching is by filename, so two files with the same name in different subfolders will collide.
- Files must be inside the case's own folder; another case's files are not visible.
- Only the extensions listed above are picked up.

To use a case image on the home timeline, reference it in `timeline.md` as `image: "cases/<slug>/<file>"`. This works only for files directly in the case folder (not in subfolders). The `vuaerizm` case does this.

### Adding an interactive diagram

For custom visuals that Markdown cannot express:

1. Create the React component in `src/components/` (see `DesignerNetworkDiagram.jsx` and `RefillingProcessFlow.jsx`, both built with `@xyflow/react`).
2. Register it in `src/lib/embeds.js`:

   ```js
   export const embeds = {
     "my-diagram": MyDiagram,
   };
   ```

3. Use it in the case: `![Optional caption](embed/my-diagram)`.

### Link previews and SEO

Everything comes from the frontmatter and the first image of the case, via `scripts/prerender-meta.mjs` during `npm run build`:

- Put a meaningful `title` and a short plain-text `description` in the frontmatter.
- Put the image you want in the preview **first** in the body. The script takes the first `![](…)` in the file.
- Meta tags are generated only at build time, so they do not appear in `npm run dev`.

### Known limitations

- `Portfolio` (`/portfolio`) is an empty stub and is not linked from the UI.
- `vuaerizm` is a placeholder case (lorem ipsum) and is not linked from the timeline.
- There is no dedicated `cover` field: the link-preview image is always the first image in the body.
