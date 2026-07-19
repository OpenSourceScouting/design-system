# Program Marks

Drop the official Scouting America assets here. They are served by Vite at
`/marks/{filename}` and consumed by two components:

- `<ProgramMark>` (`src/components/ProgramMark.tsx`): the four sub-program marks.
- `<ScoutingAmericaWordmark>` (`src/components/ScoutingAmericaWordmark.tsx`):
  the parent-brand wordmark, in two orientations.

There is intentionally no parent-brand "mark" component: per project decision,
Scouts BSA carries the historical fleur-de-lis identity for umbrella contexts.

## These files are gitignored on purpose

SVG/PNG/JPG/EPS/PDF assets in this directory are excluded from version control
(see [`.gitignore`](../../.gitignore) and [`NOTICE.md`](../../NOTICE.md)).
Trademarked BSA brand assets must not be redistributed outside the BSA Brand
Center's licensed audience (registered volunteers, council/national staff).
Each deployer downloads the assets themselves under their own eligibility.

The README you are reading is tracked; everything else here is not.

## Filename convention

The `<ProgramMark>` component supports three variants per program, selected
via the `variant` prop. Each variant maps to a filename stem:

| variant prop  | Filename stem            | Use for                                    |
| ------------- | ------------------------ | ------------------------------------------ |
| `color`       | `{program}`              | Default. Full-color official rendition on light surfaces. |
| `reversed`    | `{program}-reversed`     | White-on-dark for use on `bg-primary` (EventDialog header, RegistrationCTA, etc.). |
| `mono`        | `{program}-mono`         | Single-color. License permits "black or any dark color." |

## Supported file formats

For each variant, the component tries extensions in this priority order:

```
svg  →  webp  →  png  →  jpg  →  jpeg
```

The first one that exists wins. Drop your assets in whichever format(s) you
have; you do NOT need to convert them. Format trade-offs:

| Format | Pros                                                  | Cons                                          | Recommended for |
| ------ | ----------------------------------------------------- | --------------------------------------------- | --------------- |
| SVG    | Smallest. Crisp at any size. Supports `currentColor`. | Brand center may not export this for all programs. | Always preferred. |
| WebP   | ~30% smaller than PNG. Wide modern browser support. Supports alpha. | Slightly less universal than PNG.            | Modern raster default. |
| PNG    | Universal. Supports alpha (transparency).            | Larger than WebP for same fidelity.           | Raster fallback. |
| JPG / JPEG | Universal.                                        | **No transparency.** Background rectangle will be visible against themed surfaces. | Last resort only. |

If you only have JPGs, the marks will render with a (usually white)
rectangular background that doesn't blend with the program's tan / sea-foam /
warm-stone surfaces. Ask the brand center for PNG transparent variants if
that becomes visually distracting.

Program-mark file matrix (12 files total for the four programs):

| Program        | color (default)             | reversed                              | mono                              |
| -------------- | --------------------------- | ------------------------------------- | --------------------------------- |
| Cub Scouts     | `cub.svg`                   | `cub-reversed.svg`                    | `cub-mono.svg`                    |
| Scouts BSA     | `scoutsbsa.svg`             | `scoutsbsa-reversed.svg`              | `scoutsbsa-mono.svg`              |
| Venturing      | `venturing.svg`             | `venturing-reversed.svg`              | `venturing-mono.svg`              |
| Sea Scouts     | `seascouts.svg`             | `seascouts-reversed.svg`              | `seascouts-mono.svg`              |

You do not need every variant. `<ProgramMark>` falls back to a Lucide icon
(paw print / tent / mountain / anchor, per `PROGRAM_ICONS`) when a specific
file is missing, so you can start with just the `color` variants and add
`reversed` / `mono` later as you need them.

## Hosting note: SPA-fallback servers

`<ProgramMark>` finds an asset by trying each extension in turn and treating a
load error as "missing" so it can step to the next one (and finally to the
Lucide placeholder). That relies on a missing file returning an error.

Some hosts do not do that. Netlify, Vercel, and any server configured to serve
an app shell for unknown paths return **200 with an HTML body** for a missing
file. The browser cannot decode that as an image, so it still counts as a miss
and the placeholder still shows, but you pay up to five wasted HTML requests
per mark first. Worse, a host that returns a real fallback *image* (a default
"not found" graphic) would decode successfully and render the wrong picture.

On such hosts, bypass probing:

- **Pass an explicit `src`**: `<ProgramMark src="/marks/cub.svg" />` renders
  that URL directly, no probing. This is the robust fix.
- **Or pass `preferExtension`**: `<ProgramMark preferExtension="svg" />` tries
  that extension first, cutting the common case to one request.
- **Or `forcePlaceholder`** (per-instance) / **`forcePlaceholderMarks`** (on
  `ScoutThemeProvider`): skip real assets entirely and render the placeholder.

## Wordmark filename convention

`<ScoutingAmericaWordmark>` takes two props: `orientation` (`wide` | `tall`)
and `variant` (`color` | `mono` | `reversed`). The file stem combines them:

```
scouting-america-wordmark-{orientation}[-{variant}].{ext}
```

The variant suffix is omitted for `color` (the default), matching how the
program marks omit it for their color variant.

Wordmark file matrix (6 files total):

| Orientation | color (default)                              | mono                                              | reversed                                              |
| ----------- | -------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| Wide        | `scouting-america-wordmark-wide.svg`         | `scouting-america-wordmark-wide-mono.svg`         | `scouting-america-wordmark-wide-reversed.svg`         |
| Tall        | `scouting-america-wordmark-tall.svg`         | `scouting-america-wordmark-tall-mono.svg`         | `scouting-america-wordmark-tall-reversed.svg`         |

**Wide** is the horizontal lockup (mark beside the text). **Tall** is the
stacked lockup (mark above the text).

Unlike `<ProgramMark>`, the wordmark has **no placeholder fallback**. If no
asset is found across all extensions, the component renders nothing and logs
a warning to the console. The wordmark is reserved for official Scouting
contexts and the project will not invent a generic substitute.

## Source files in the brand center

The Brand Center exports use longer descriptive names. Save them locally
under the conventional filenames above.

| Brand center label              | Save as                  | Notes                                      |
| ------------------------------- | ------------------------ | ------------------------------------------ |
| "...Trademark Full Color RGB"   | `{program}.svg` or `scouting-america-wordmark-{orientation}.svg` | Screen/RGB version is the right one for web. |
| "...Trademark Reversed RGB"     | `{program}-reversed.svg` or `scouting-america-wordmark-{orientation}-reversed.svg` | The white-on-dark version. |
| "...Trademark One Color Black"  | `{program}-mono.svg` or `scouting-america-wordmark-{orientation}-mono.svg` | License permits recoloring to any dark color. |

Other Brand Center exports you can safely ignore for web (still allowed in
print pipelines if you build them later):

- "...CMYK" or "Four Color CMYK": for print PDFs
- "...Spot Color" or "PMS": for spot-color print
- Lockups with "Local Council Name" placeholders: covered by council
  signature requirements, not the program mark API

## Rules (from 2024 Brand Guidelines and BSA Brand Center license)

- **Prefer SVG.** Vector enforces the "no effects, no tints, no truncation"
  rule by construction and supports `currentColor` for the mono variant.
  `<ProgramMark>` and `<ScoutingAmericaWordmark>` intentionally do not apply
  any color utilities to real assets. They do apply `mix-blend-mode` to JPGs
  to key out the file's solid background against the surrounding surface;
  this alters on-screen compositing but does not modify the source bytes.
- **Do not** edit, recolor, or apply effects to these files. They are
  trademarked artwork and must be used as received.
- The `®` registration mark must be present in the source file as supplied
  by the brand center. Do not add or remove it.
- Per Guidelines p.34: any third-party manufacture or distribution of
  products bearing these marks requires Scouting America National Council
  licensing. See <https://www.scouting.org/licensing>.

## Where to download

- Official brand center: <https://scouting.webdamdb.com/bp/#/>
- 2024 Brand Guidelines (provenance for this design system):
  <https://pathwaytoadventure.org/wp-content/uploads/2024/05/Scouting-America-Brand-Guidelines-2024-BC.pdf>

You must be signed in as a registered BSA volunteer or council/national
employee to download from the brand center.
