# Home page timeline

The home page (`/`) is a vertical timeline of career milestones. Its content lives in a single file, [`src/timeline/timeline.md`](../src/timeline/timeline.md), so adding or editing an entry never requires touching React code.

## How it works

1. `src/lib/timeline.js` reads `timeline.md` at build time and parses its YAML frontmatter with `js-yaml`.
2. It resolves each item's `image` to a real file URL (see [Images](#images)).
3. `src/components/Timeline.jsx` renders the items top to bottom, one `TimelineItem` each. The first item in the file is shown first, so keep the list newest first.

The file contains only a YAML frontmatter block with an `items` list.

## Item format

```yaml
---
items:
  - date: |-
      July '26
      – February '19
    title: "HTML allowed here, e.g. <a href=\"https://example.com\">links</a>"
    subheader: "Optional short paragraph under the title"
    image: "enapter.mp4"
    imageDescription: "Optional caption under the image"
    buttonPrimary:
      label: "Explore case study"
      href: "/cases/refilling-ftue"
    buttonSecondary:
      label: "Watch on Youtube"
      href: "https://www.youtube.com/watch?v=..."
      newTab: true
---
```

| Field | Notes |
|---|---|
| `date` | Shown in the left column. Use the `\|-` block form so each line break is preserved (for example, an end date on a second line) |
| `title` | Rendered as **HTML**, so links and emoji work. Keep the content trusted and escape double quotes (`\"`) inside the YAML string |
| `subheader` | Optional paragraph. Leave `""` to hide |
| `image` | Optional. See [Images](#images). Leave `""` to hide |
| `imageDescription` | Optional caption. Also used as the image's alt text |
| `buttonPrimary` | Filled button. Hidden when `label` is empty |
| `buttonSecondary` | Outlined button. Hidden when `label` is empty |

### Buttons

- `href` starting with `/` is an in-app link (for example `/cases/my-case`).
- Any other `href` is a normal link. Add `newTab: true` to open it in a new tab.
- Both buttons are optional. If both labels are empty, no button row is rendered.

### Images

`image` accepts either:

- a filename from [`src/img/`](../src/img), for example `chemistry.gif`;
- a path into a case folder, `cases/<slug>/<file>`, for example `cases/vuaerizm/vuaerizm-1.jpeg`. The file must be directly in the case folder, not in a subfolder.

Supported types: `png jpg jpeg gif svg webp mp4 webm mov`. Videos (`mp4`, `webm`, `mov`) autoplay muted in a loop. If the name is not found, the value is used as-is, which usually means a broken image, so check the spelling.

## Adding a new entry

1. If the entry has media, put the file into `src/img/`.
2. Add a new item to `items` in `src/timeline/timeline.md`, in the right chronological place (newest on top).
3. If the entry should lead to a case study, set `buttonPrimary.href` to `/cases/<slug>`. Creating the case itself is described in [How to create a case study](cases.md).
4. Run `npm run dev` and check the home page.
