# Home page

The home page (`/`) is a horizontal lane of cards: the intro, one card per case study, and the contact card. All of their text and media live in [`content/home/home.md`](home.md), so editing the home page never requires touching React code.

## How it works

1. `src/lib/home.js` reads `home.md` at build time and parses its YAML frontmatter with `js-yaml`.
2. It resolves media paths against [`content/home/src/`](src) and pulls each case card's client and year from the case itself.
3. `src/pages/Home.jsx` renders the cards in this order: intro, the cases in the order of `cases`, contact.

The file contains only a YAML frontmatter block with three sections: `intro`, `cases` and `contact`.

## Format

```yaml
---
intro:
  avatar: "avatar.jpg"
  avatarAlt: "Antonina Khisametdinova"
  name: |-
    Antonina,
    Staff UX designer
  headlineMuted: "Shaping and delivering modern enterprise software"
  headlinePrimary: "for industrial and deep-tech sectors"
  caption: "13 years of experience in…"
  links:
    - icon: "github"
      label: "Github"
      href: "https://github.com/ninadiz"

cases:
  - case: "refilling-ftue"
    title: "Maintenance wizards cut refilling-related support requests from 80% to zero."
    media: "refilling-ftue/home-card.webm"
    color: "#DCDCDC"
    hoverColor: "#081499"
    hoverMetaColor: "#13BDD7"

contact:
  headline: "Let's work together"
  links:
    - label: "ninadiz2291@gmail.com"
      href: "mailto:ninadiz2291@gmail.com"
---
```

### `intro`

| Field | Notes |
|---|---|
| `avatar` | Image in `content/home/src/` |
| `avatarAlt` | Alt text of the avatar |
| `name` | Text next to the avatar. Use the `\|-` block form; each line break is kept |
| `headlineMuted`, `headlinePrimary` | The headline: a grey part, then a black part on a new line |
| `caption` | Paragraph in the bottom left corner |
| `links` | Round icon buttons in the bottom right corner, in this order. `icon` is one of `github`, `telegram`, `linkedin` (the icons are drawn in `Home.jsx`; a link with another icon is skipped). `label` is the accessible name. They open in a new tab |

### `cases`

One entry per card, in the order they appear. A case that is not listed is not shown on the home page (it still has its own page and appears on `/cases`).

| Field | Notes |
|---|---|
| `case` | Case folder name in `content/cases/`. The card links to `/cases/<case>` and shows the case's `client` and `date` above the title. An unknown name is skipped |
| `title` | Card title. Leave `""` to use the case's own `title` |
| `media` | Video or image for the top of the card, a path inside `content/home/src/`. Keep each case's files in a folder named like the case: `refilling-ftue/home-card.webm`. Leave `""` to show the case cover (the first image in the case) |
| `color` | Card background as `#rrggbb`, e.g. `"#DCDCDC"` (a grey slightly darker than the page background `#F0F0F0`). On a dark colour such as `"#325CFF"` the card text turns white automatically; on a light one it stays dark. Leave `""` for a white card |
| `hoverColor` | Background on hover (desktop), e.g. `"#081499"`. It spreads as a circle from the point where the pointer enters the card and shrinks back to where it leaves. On a dark colour the text turns white during hover. Leave `""` to keep `color` on hover |
| `hoverMetaColor` | Colour of the client and year line on a dark `hoverColor`, e.g. `"#13BDD7"`. Leave `""` for white at 60% |

**Media size.** The media block is 520×396 on a 520×600 card, 64px from the top, so render media at 1040×792 for Retina.

**Video.** Make it transparent so it sits on `color` with no visible edge, and put three files side by side in the case's folder:

- `home-card.webm`: VP9 with alpha, for Chrome, Firefox and Edge. Point `media` at this file;
- `home-card.mov`: the same video as HEVC with alpha (`hvc1`), for Safari and every browser on iOS, which ignore WebM transparency. It is found by name;
- `home-card.poster.webp`: the first frame, transparent too. It shows while the video loads and replaces it on a very slow connection, see [Video placeholders](../cases/cases.md#video-placeholders).

**Loading and start.** Until the poster, the first video frame or the image has loaded, the card shows a shimmering skeleton in the media area (the avatar has one too). When the site is opened on the home page, it comes in step by step, each part dissolving in: the menu, then the intro card, whose headline lines slide up one after another from under an invisible edge, then the other cards and the pagination, one after another. The case videos wait on their first frame until the last card is in. Coming back to the home page later without a reload shows everything at once and plays the videos straight away. With "reduce motion" turned on in the system, there is no entrance animation and the videos start at once.

### `contact`

| Field | Notes |
|---|---|
| `headline` | Large text at the top of the black card |
| `links` | Lines in the bottom left corner, in this order. `href` can be `mailto:` or a URL |

## Adding a case card

1. Create the case itself, see [How to create a case study](../cases/cases.md).
2. If the card has its own video or image, put it into `content/home/src/<case>/`.
3. Add an entry to `cases` in `home.md` at the position where the card should appear.
4. Run `npm run dev` and check the home page.
