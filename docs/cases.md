# Case studies

A case study is a Markdown file with YAML frontmatter, rendered by [`src/pages/CaseStudy.jsx`](../src/pages/CaseStudy.jsx). The URL and the folder are tied together: `src/cases/refilling-ftue/index.md` is served at `/cases/refilling-ftue`.

## How to add a new case

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

4. **Link it from the home page.** A case does **not** appear anywhere automatically. Add (or edit) an item in [`src/timeline/timeline.md`](../src/timeline/timeline.md) and point a button at the case (see [timeline docs](timeline.md)):

   ```yaml
   buttonPrimary:
     label: "Explore case study"
     href: "/cases/my-new-case"
   ```

5. **Check it locally.** Run `npm run dev` and open `/cases/my-new-case`. A missing image shows a placeholder with its caption instead of failing, which is a sign that the filename or path is wrong.

6. **Check the production build.** This is the step that generates link previews:

   ```bash
   npm run build
   ```

   The log should contain `Prerendered meta for /cases/my-new-case`. Optionally run `npm run preview` and open `http://localhost:4173/cases/my-new-case`.

7. **Commit and deploy.**

## Frontmatter fields

| Field | Used for |
|---|---|
| `title` | Page heading, browser tab (`<title>` becomes "title — Ninadiz") and link previews |
| `description` | Intro under the heading (Markdown and inline HTML allowed). Also the meta description for link previews: plain text, cut to 200 characters. If empty, the site-wide default is used |
| `tags` | List of tags shown under the title |
| `client`, `clientLogo`, `clientDescription` | Client block. Shown only when **both** `clientLogo` and `clientDescription` are set. `clientLogo` is a path inside the case folder |
| `date` | Parsed but not displayed on the page at the moment |

## Authoring syntax

Standard Markdown plus a few custom tags. Custom tags go on their own line.

| Syntax | Result |
|---|---|
| `{h2} Text` | Section heading. Each `{h2}` also starts a new section block with its own spacing, so use it to divide the case |
| `{title} Text` | Large `h1`-style heading inside the body (rarely needed: the title comes from frontmatter) |
| `{p} Text` | Plain paragraph (the tag is just stripped) |
| `{wide}` on the line above `![alt](file)` | Makes that one image full-width |
| `![caption](img/file.jpg)` | Image or video (video extensions autoplay muted in a loop). The alt text is shown as a caption |
| `{carousel}` … `{/carousel}` around several `![alt](file)` lines | Image carousel with arrows and dots |
| `![caption](embed/<key>)` | Interactive React component from `src/lib/embeds.js` (see [below](#adding-an-interactive-diagram)) |
| `[text](# "Explanation")` | Tooltip with the explanation. Any link with a title becomes a tooltip trigger |
| `[text](https://…)` | Regular link, opens in a new tab |
| `<a href="img/file.docx" title="button">Label</a>` | Download button (pill style). The href is resolved against the case's assets |
| Raw HTML | Allowed (`rehype-raw`), for example the `case-study__row` blocks in `refilling-ftue` for "Step Artifacts" rows |

## How assets are resolved

Paths in `index.md` (images, `clientLogo`, download buttons, carousel items) are matched against the files in the case folder, either by relative path (`img/cover.jpg`) or by bare filename (`cover.jpg`). Practical consequences:

- Use **unique filenames** within a case. Matching is by filename, so two files with the same name in different subfolders will collide.
- Files must be inside the case's own folder. Another case's files are not visible.
- Only the extensions listed above are picked up.

To use a case image on the home timeline, reference it in `timeline.md` as `image: "cases/<slug>/<file>"`. This works only for files directly in the case folder (not in subfolders). The `vuaerizm` case does this.

## Adding an interactive diagram

For custom visuals that Markdown cannot express:

1. Create the React component in `src/components/` (see `DesignerNetworkDiagram.jsx` and `RefillingProcessFlow.jsx`, both built with `@xyflow/react`).
2. Register it in `src/lib/embeds.js`:

   ```js
   export const embeds = {
     "my-diagram": MyDiagram,
   };
   ```

3. Use it in the case: `![Optional caption](embed/my-diagram)`.

## Link previews and SEO

Everything comes from the frontmatter and the first image of the case, via [`scripts/prerender-meta.mjs`](../scripts/prerender-meta.mjs) during `npm run build`:

- Put a meaningful `title` and a short plain-text `description` in the frontmatter.
- Put the image you want in the preview **first** in the body. The script takes the first `![](…)` in the file. Without any image it falls back to `public/og-image.png`.
- Meta tags are generated only at build time, so they do not appear in `npm run dev`.

## Known limitations

- There is no dedicated `cover` field: the link-preview image is always the first image in the body.
- `vuaerizm` is a placeholder case (lorem ipsum) and is not linked from the timeline.
