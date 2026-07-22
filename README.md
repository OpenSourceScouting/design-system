<p align="center">
  <img
    src="https://raw.githubusercontent.com/opensourcescouting/design-system/main/public/oss/opensourcescouting-logo-color.png"
    alt="Open Source Scouting"
    width="160"
    height="160"
  />
</p>

<h1 align="center">Scouting America Design System</h1>

<p align="center">by <strong>Open Source Scouting</strong></p>

A React + Tailwind component library for the Scouting America parent brand and
its four program sub-brands: **Cub Scouts**, **Scouts BSA**, **Venturing**, and
**Sea Scouts**.

Built directly from the [Scouting America 2024 Brand Guidelines](https://pathwaytoadventure.org/wp-content/uploads/2024/05/Scouting-America-Brand-Guidelines-2024-BC.pdf).

> **Community project:** This library is built and maintained by registered
> Scouting volunteers. It is not an official Scouting America product and is
> not affiliated with, endorsed by, or sponsored by Scouting America or the
> Boy Scouts of America. The `@opensourcescouting` package scope reflects that
> community status. Official BSA brand assets remain governed by the BSA
> Brand Center license (see `NOTICE.md`).

Not using React? [`unofficial-brand-guide.md`](./docs/unofficial-brand-guide.md) is a self-contained
brand reference (colors, type, voice, print values, trademark rules) that you
or any AI tool can use to produce on-brand scouting materials without this
codebase.

## Which document do I need?

| I am...                                        | Start here                                                      |
| ---------------------------------------------- | --------------------------------------------------------------- |
| A developer installing the package             | This README (you are here)                                      |
| A designer, marketer, or AI tool               | [`unofficial-brand-guide.md`](./docs/unofficial-brand-guide.md) |
| Checking trademark or asset license rules      | [`NOTICE.md`](./NOTICE.md)                                      |
| Wanting to contribute code                     | [`CONTRIBUTING.md`](./.github/CONTRIBUTING.md)                  |
| Picking up a backlog task                      | [`TODO.md`](./docs/TODO.md)                                     |
| Understanding why the architecture is this way | [`docs/decisions/`](./docs/decisions/)                          |
| A coding agent working inside this codebase    | [`CLAUDE.md`](./CLAUDE.md)                                      |
| Stuck, or reporting a bug                      | [Getting help](#getting-help)                                   |

## Quick start

```bash
npm install
npm run dev        # interactive showcase at http://localhost:5173
npm run storybook  # component explorer at http://localhost:6006
```

## Use this in your app

### Install

From the npm registry (once published):

```bash
npm install @opensourcescouting/design-system
```

Or directly from a packed tarball during early adoption (the filename carries
the current version, e.g. `opensourcescouting-design-system-<version>.tgz`):

```bash
npm install ./opensourcescouting-design-system-<version>.tgz
```

**Supported React versions:** React 18 and React 19 (peer dependency `react >= 18`).
React and react-dom are peers; they must already be in your project.

### Choose your setup

This package targets Tailwind CSS v4 and configures itself in CSS, not in a
`tailwind.config.js`. There is no JS preset. Pick one of two paths depending on
whether you write your own Tailwind utilities.

**Path A: render our components, no Tailwind build of your own.** Import the
compiled stylesheet once at your app entry. It carries every utility our
components use, plus the token variables. Nothing else to configure.

```ts
// main.tsx (or index.ts, _app.tsx, etc.)
import "@opensourcescouting/design-system/styles";
```

This stylesheet only contains the classes our components use. Utilities you
write in your own markup (`bg-primary`, `text-foreground`, and so on) are not in
it. If you write your own, use Path B.

**Path B: you run Tailwind v4 in your app.** Add the Tailwind Vite plugin, then
import our tokens and theme into your entry CSS. Your build regenerates the
program and shadcn utilities against your own source scan, so `bg-primary` and
friends work in your markup and re-theme per program.

```css
/* your entry CSS, e.g. src/index.css */
@import "tailwindcss";
@import "@opensourcescouting/design-system/tokens"; /* the CSS variables, per program */
@import "@opensourcescouting/design-system/theme"; /* maps those variables to utilities */
```

The `./tokens` export is the variables alone, for non-Tailwind projects or for
reading token values directly. The `./theme` export adds the `@theme` mapping
that turns them into utilities, and replaces the old v3 preset.

### Minimal working snippet

```tsx
import { ScoutThemeProvider, Button } from "@opensourcescouting/design-system";

export function App() {
  return (
    <ScoutThemeProvider program="cub">
      <Button variant="primary">Join Cub Scouts</Button>
    </ScoutThemeProvider>
  );
}
```

`ScoutThemeProvider` sets the `data-program` attribute on its root element and
provides program metadata through React context. Components that read program
metadata (such as `ProgramHero`, `ProgramMark`, and `RegistrationCTA`) require
a `ScoutThemeProvider` ancestor.

> **Wrap your app in `ScoutThemeProvider`.** Forgetting it is the most common
> setup mistake: components render unthemed (a stray red accent is the usual
> tell) and the metadata-reading components throw. If accent buttons show up
> red when you expected a program color, that missing provider is why (more in
> [Override colors for your council](#override-colors-for-your-council)).

Notable `ScoutThemeProvider` props:

- **`applyToDocument`** (boolean, default `false`): applies `data-program` to
  `<html>` via a `useEffect`, theming the entire document instead of just the
  provider's subtree. Cleanup restores the previous attribute value when the
  provider unmounts or `program` changes, so multiple providers and hot-reload
  work correctly.
- **`forcePlaceholderMarks`** (boolean, default `false`): forces every
  `ProgramMark` in the subtree to render its inline placeholder SVG even when
  a real asset file is present on the server. Use this for portfolio screenshots,
  OSS preview builds, or any context where the licensed BSA marks cannot
  lawfully be displayed. A per-instance `forcePlaceholder` prop on `ProgramMark`
  takes precedence over this subtree-wide flag.

  **Recommended default for public / open-source deployments.** With it off,
  `ProgramMark` probes `/marks/` for real asset files and falls back to the
  placeholder when they 404, which is correct behavior but produces console
  404 noise on any site that ships no marks (and most public deployments
  cannot lawfully ship the licensed marks). Set `forcePlaceholderMarks` at
  the provider to skip the probe entirely: it is both the quieter option and
  the correct trademark posture for public sites.

### Override colors for your council

Every program color is a CSS custom property carrying a space-separated RGB
triplet (no `rgb()` wrapper). You can override any token by targeting the
`[data-program]` attribute in your own stylesheet:

```css
/* council.css: override the Cub Scouts brand accent to your council color */
[data-program="cub"] {
  --os-accent: 13 115 119; /* R G B, no commas (example: a council teal) */
}
```

The brand accent (gold, yellow, red) lives in `--os-accent`, not the shadcn
`--accent`. The shadcn `--accent` is the muted hover wash used by menus and
hover states, so override `--os-accent` when you want to change the branded
pop, and `--primary` for the main brand color. See the token reference in
`docs/unofficial-brand-guide.md`.

Avoid red as an override on scout-facing surfaces. Red is the parent brand's
accent and doubles as the unthemed fallback (see below), so a red accent reads
as either an error state or a broken theme.

The space-separated format is required because Tailwind v4 applies opacity
modifiers with `color-mix`: `bg-os-accent/80` composites the token at 80%. A
full `rgb(220, 38, 38)` value would still work, but the triplet keeps the
whole token set consistent.

Full list of overridable tokens is in `src/styles/tokens.css` (shipped as
`dist/tokens.css` in the package).

Troubleshooting tell: if accent buttons render RED on a page you expected
gold, your theming is not wired up. The `:root` fallback palette is the
parent Scouting America brand, whose accent is SA Red (#CE1126), so a red
accent means the element has no `data-program` ancestor (missing
`ScoutThemeProvider`) or the token CSS never loaded.

### Motion (per-program feel)

Each program carries a motion language alongside its colors: Cub Scouts
overshoots slightly (a playful bounce), Venturing snaps, Sea Scouts glides, and
Scouts BSA stays steady. It is three overridable tokens per program:

| Token                       | What it controls                        |
| --------------------------- | --------------------------------------- |
| `--os-motion-easing`        | the timing-function (the "feel")        |
| `--os-motion-duration-base` | base tempo (surfaces, e.g. Card)        |
| `--os-motion-duration-fast` | quick interactions (button press/hover) |

They map to the `ease-program`, `duration-program`, and `duration-program-fast`
utilities. Retune the feel per program the same way you override colors, no
component changes:

```css
[data-program="cub"] {
  --os-motion-easing: cubic-bezier(0.2, 0, 0, 1); /* calmer than the default bounce */
  --os-motion-duration-base: 200ms;
}
```

The defaults are intentionally conservative and meant to be adjusted. Users with
`prefers-reduced-motion: reduce` get near-zero durations automatically (handled
globally in `tokens.css`), so overrides never override that.

### Register a custom program

The four national programs ship built in, but `program` is an open string type
(`KnownProgram | (string & {})`), so a council can add a fifth brand (a custom
youth program, or a future national program) without forking the package:

1. Define a `[data-program="yourprogram"]` block in your own stylesheet with the
   full token set. Copy an existing block from `dist/tokens.css` as a template;
   `[data-program]` blocks are the only per-program differentiation, so no
   component code changes.
2. Pass the name straight to the provider: `<ScoutThemeProvider program="yourprogram">`.
   The raw name is stamped onto `data-program` verbatim, so your token block
   themes the subtree (and portalled widgets, via the delta-9 re-stamp).

```tsx
<ScoutThemeProvider program="explorers">
  <App />
</ScoutThemeProvider>
```

```css
/* council.css: a full custom program block (abbreviated) */
[data-program="explorers"] {
  --primary: 13 115 119;
  --os-accent: 240 180 0;
  /* ...the rest of the token set from dist/tokens.css... */
}
```

Two built-in behaviors fall back to Scouts BSA (the `DEFAULT_PROGRAM`) for a
custom program, because they have no per-program CSS: `PROGRAM_META` (label,
tagline, age range: consumed by `ProgramHero` / `RegistrationCTA`) and the
`PROGRAM_ICONS` placeholder glyphs. Supply your own copy via component props to
override. Use the exported `isKnownProgram()` / `resolveKnownProgram()` helpers
if your own code needs to branch on this. The `forced-colors` (Windows High
Contrast) reset targets `[data-program]` universally, so your custom program
gets high-contrast support automatically.

### Custom themes (e.g. dark mode)

The library intentionally ships **no dark mode**: Scouting America has no dark
palette and this package aligns to the official design system. But because
theming is just CSS-variable overrides selected by attribute, an individual unit
or project can layer its own theme without forking. Pass a `theme` to
`ScoutThemeProvider` and supply the token overrides in your own CSS, scoped to
`[data-theme]`:

```tsx
<ScoutThemeProvider program="cub" theme="dark">
  <App />
</ScoutThemeProvider>
```

```css
/* your app CSS: a dark layer, composed on top of the program tokens */
[data-theme="dark"] {
  --background: 12 15 20;
  --foreground: 240 244 248;
  /* ...override the tokens you want dark... */
}
/* scope to one program if the dark values differ per brand: */
[data-theme="dark"][data-program="seascouts"] {
  --primary: 90 140 200;
}
```

`theme` is stamped as `data-theme` on the provider's element (and on `<html>`
with `applyToDocument`), and is re-stamped onto portalled widgets (dialogs,
menus, tooltips) via `useProgramStamp`, so your theme applies inside overlays
too, not just the main subtree. It composes with any program and needs no
component changes. Toggling `theme` between values (or to `undefined`) is how
you build a light/dark switch.

### Serve program marks from a subpath

By default, `ProgramMark` loads files from `/marks/` on the same origin. If
your app is deployed at a subpath (for example `https://pack42.org/events/`)
or you host assets on a CDN, set the base path in one of these ways:

```tsx
// 1. Per-provider (covers all ProgramMark instances inside it)
<ScoutThemeProvider program="cub" marksBasePath="/events/marks/">

// 2. Per-component
<ProgramMark program="cub" basePath="https://cdn.pack42.org/brand/" />
```

Or set `VITE_MARKS_BASE_URL` in `.env.local` for a build-time default.

### SPA router integration

`EventCard`, `EventDialog`, and `RegistrationCTA` accept a `navigate` prop so
you can drive navigation through your own router instead of
`window.location.href`:

```tsx
import { useNavigate } from "react-router-dom";
import { EventCard } from "@opensourcescouting/design-system";

function MyPage() {
  const navigate = useNavigate();
  return <EventCard event={event} navigate={(url) => navigate(url)} />;
}
```

When `navigate` is omitted, the components fall back to `window.location.href`
assignment, which works fine for non-SPA deployments.

## Architecture

```
src/                       # the published library ONLY
├── styles/
│   ├── tokens.css        # CSS custom properties per program (the source of truth)
│   ├── theme.css         # Tailwind v4 @theme mapping + @utility + base layer (the ./theme export)
│   ├── globals.css       # dev/Storybook/demo entry: Tailwind layers + tokens + theme, broad source scan
│   └── library.css       # published entry (scoped source scan) -> dist/styles.css
├── lib/
│   ├── theme/
│   │   └── ScoutThemeProvider.tsx   # React context + data-program attribute; useProgramStamp, normalizeBasePath
│   ├── utils/
│   │   ├── cn.ts         # clsx + tailwind-merge
│   │   └── date.ts       # vanilla Date math (no date-fns)
│   └── links.ts          # SCOUTING_LINKS / SCOUTING_LINK_LIST canonical resource URLs
├── components/            # one file per component, .stories.tsx alongside; a sample, not the full list
│   ├── Button.tsx        # Primitives; variant="accent" size="sm" excluded at the type level (WCAG AA)
│   ├── Card.tsx          # Card, CardBody, CardHeader, CardFooter, CardEyebrow
│   ├── Badge.tsx
│   ├── Heading.tsx
│   ├── Alert.tsx
│   ├── ProgramMark.tsx       # Auto-loads from /marks/, falls back to inline placeholder SVGs
│   ├── ProgramIcon.tsx       # Per-program fallback icons + PROGRAM_ICONS registry
│   ├── ScoutingAmericaWordmark.tsx  # Parent brand wordmark (wide / tall orientations)
│   ├── DecorativeDivider.tsx  # Per-program ornamental divider
│   ├── ProgramHero.tsx       # Marketing patterns
│   ├── FeatureGrid.tsx
│   ├── EventCard.tsx         # Operational program patterns
│   ├── RegistrationCTA.tsx
│   ├── Calendar.tsx          # Month + agenda views; CalendarEvent supports featured
│   ├── EventDialog.tsx       # Built on the shadcn Dialog (Radix) recipe; the native <dialog> was retired
│   ├── Field.tsx, TextInput.tsx, Textarea.tsx, Select.tsx, NativeSelect.tsx,
│   │   Checkbox.tsx, Switch.tsx, RadioGroup.tsx     # form layer
│   ├── Dialog.tsx, AlertDialog.tsx, DropdownMenu.tsx, Popover.tsx,
│   │   Tooltip.tsx, Toaster.tsx, Tabs.tsx, Accordion.tsx,
│   │   NavigationMenu.tsx    # Tier-1 shadcn recipes on Radix
│   ├── Icon.tsx           # Lucide wrapper with sizing/stroke/a11y conventions
│   └── MadeWithBadge.tsx
├── stories/               # Introduction.mdx + Colors.stories.tsx (cross-component)
└── index.ts               # public package entry (barrel)

demo/                      # dev-only showcase; Vite root for `dev` + `build:demo`, NOT published
├── index.html
├── main.tsx               # font imports (@fontsource-variable) + globals.css
└── App.tsx                # end-to-end demo with program switcher
```

## How theming works

Every theme-aware style resolves through a CSS custom property like `--primary`.
The system uses shadcn's semantic token names (`--primary`, `--background`,
`--accent`, and so on) plus an `--os-*` set for concepts shadcn does not cover,
such as the brand accent. Tailwind utilities (`bg-primary`, `text-foreground`,
and the rest) map to those variables in `src/styles/theme.css` (shipped as the
`./theme` export). Selecting an ancestor with the right `data-program="..."`
attribute re-binds the variables, so the same utility renders each program.

```tsx
import { ScoutThemeProvider, Button } from "./src";

<ScoutThemeProvider program="venturing">
  <Button variant="primary">Charge ahead</Button>
</ScoutThemeProvider>;
```

You can nest providers; a Venturing card on a Scouts BSA page is supported.

## Programs at a glance

| Program    | Primary   | Primary Pantone | Accent    | Accent Pantone | Personality                                |
| ---------- | --------- | --------------- | --------- | -------------- | ------------------------------------------ |
| Cub Scouts | `#003F87` | PMS 294         | `#FDC116` | PMS 116        | Rounded, bold, warm. Display weight 900.   |
| Scouts BSA | `#243E2C` | none listed     | `#003F87` | PMS 294        | Crisp, traditional. Display weight 700.    |
| Venturing  | `#006B3F` | PMS 349         | `#FCD116` | PMS 116        | Sharp, BOLD UPPERCASE. Display weight 800. |
| Sea Scouts | `#003366` | none listed     | `#FFCC00` | none listed    | Linear, italic editorial. Weight 600.      |

Full CMYK and Pantone data (including secondary tans, grays, and mark-reproduction colors) is in [`src/styles/tokens.print.json`](./src/styles/tokens.print.json) and ships in the package at `dist/tokens.print.json`.

### The `sa-red` raw palette utility

The theme defines a raw Tailwind color `sa-red` (`#CE1126`, Scouting America
Red) as a fixed palette entry, separate from the themed tokens. The same value
also backs `--destructive`. Reserve it for true error and danger states: form
validation errors, destructive action confirmations, and alert banners that
signal failure.

Do not use `sa-red` as a general accent or brand color on program pages. The
parent brand red reads as either an error state or a broken theme, and it is the
`:root` fallback when no `data-program` ancestor exists. For a program's brand
accent use `bg-os-accent`; for validation use `text-destructive` /
`border-destructive`.

## Tokens as data (JSON / SCSS / email)

The tokens ship in three forms: Tailwind utilities, CSS variables, and
framework-neutral data. That last form lets non-web tools (Figma, SCSS projects,
email builders) and non-Tailwind code use the exact brand values without
hand-copying hex codes. `src/styles/tokens.css` remains the authored source of
truth; everything below is generated from it (`npm run build:tokens` regenerates
the typed module, and `npm run build` emits the file artifacts), so nothing
drifts.

**Typed data, for JavaScript/TypeScript.** Import `TOKENS`, the same way you
import `SCOUTING_LINKS`. Use it when you need a brand value in JS rather than as
a class: a chart color, a `<canvas>`, an SVG generator, React Native.

```ts
import { TOKENS } from "@opensourcescouting/design-system";

TOKENS.cub.colors["os-accent"].hex; // "#FDC116"
TOKENS.cub.colors.primary.rgb; // [0, 63, 135]
```

Keys are `root` (parent brand) plus the four programs; each has `colors` (every
color token, as an `{ rgb, hex }` pair) and `values` (non-color tokens such as
`radius` and `os-shadow`, as raw CSS strings).

**File artifacts, for tools that read files, not imports.** These ship in the
package and are addressable by subpath:

| Subpath                                               | What                                              | For                                                                        |
| ----------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| `@opensourcescouting/design-system/tokens.json`       | full token set per palette (rgb + hex + values)   | Figma / Tokens Studio, general tooling                                     |
| `@opensourcescouting/design-system/tokens.scss`       | a `$sa-tokens` Sass map of the color tokens (hex) | SCSS/Sass projects                                                         |
| `@opensourcescouting/design-system/tokens.email.json` | hex-only, flat per program                        | email builders (Mailchimp, Constant Contact) that cannot use CSS variables |

Print (CMYK/Pantone) equivalents are a separate artifact,
[`tokens.print.json`](./src/styles/tokens.print.json) (see above).

## Email

Email clients do not support CSS variables, external stylesheets, or modern
layout, and many strip `<style>` blocks, so none of the React components or the
Tailwind stylesheet apply. Email is built with table layout and **inline hex
styles**. The package ships the brand values in email-ready shapes:

- [`examples/email-template/index.html`](./examples/email-template/) is a
  copy-pasteable, table-based HTML email with inline hex styles (a header band,
  a bulletproof CTA button, a footer), themed for Cub Scouts. Swap the hex
  values for another program to retheme.
- `@opensourcescouting/design-system/tokens.email.json` is the hex-only, flat
  per-program token map to pull those values from (no `var()`, no opacity
  composites).
- `@opensourcescouting/design-system/email.css` is a flat stylesheet of hex
  utility classes (`.{program}-{token}-bg` / `-text`) for the email clients that
  do honor an embedded `<style>` block. Inline styles remain the primary path.

## Configuring where assets are served from

By default, `<ProgramMark>` loads files from `/marks/`. You can override that
in four places, in priority order (highest wins):

1. **Per-call prop**: `<ProgramMark basePath="/assets/brand/" />`
2. **Per-app prop on the theme provider**: `<ScoutThemeProvider marksBasePath="https://cdn.example.org/scouting/">...</ScoutThemeProvider>`
3. **Build-time env var**: set `VITE_MARKS_BASE_URL` in `.env.local` (see `.env.example`)
4. **Default**: `/marks/` (no config required)

The path accepts trailing slash or not (both work) and can be either a
relative path on the same origin or an absolute URL (CDN, separate hostname,
etc.). The component looks for files at `{basePath}{program}[-variant].{ext}`
and tries extensions in the order `svg → webp → png → jpg → jpeg`.

```bash
# Example: deploy with assets on a CDN
echo "VITE_MARKS_BASE_URL=https://cdn.pack42.org/brand/" > .env.local
npm run build
```

### SPA-fallback hosts (Netlify, Vercel, and similar)

`<ProgramMark>` discovers an asset by trying each extension and treating a load
failure as "missing." That breaks down on hosts that return **200 with an app
shell** for unknown paths: every probe "succeeds" at the HTTP level. An HTML
body still fails to decode as an image, so the placeholder still appears, but
you waste up to five requests per mark; and a host that returns a real fallback
image would render the wrong picture. Bypass probing on these hosts:

- **`src`** (robust): `<ProgramMark src="/marks/cub.svg" />` renders that exact
  URL, no probing.
- **`preferExtension`**: `<ProgramMark preferExtension="svg" />` tries that
  extension first, cutting the common case to one request.
- **`forcePlaceholder`** / provider `forcePlaceholderMarks`: skip real assets
  and render the placeholder.

## Swapping in real brand assets

The `ProgramMark` component **auto-loads** official marks from `/marks/{program}.svg`
when those files are present, and falls back to inline placeholder SVGs
otherwise. No code change is required to switch modes.

1. Confirm you're a registered BSA volunteer or council/national employee and
   have leadership approval for your deployment channel.
2. Download the official marks from the
   [Scouting America brand center](https://scouting.webdamdb.com/bp/#/) while
   signed in as yourself.
3. Drop `cub.svg`, `scoutsbsa.svg`, `venturing.svg`, `seascouts.svg` (and
   optionally `scouting-america.svg`) into `public/marks/`. These files are
   gitignored; they live on your deployment, not in the repo.
4. Run your dev/build/deploy as normal. `ProgramMark` will pick them up.

To force placeholder mode for a portfolio screenshot, demo, or any
non-approved context, pass `<ProgramMark forcePlaceholder />`.

See [`NOTICE.md`](./NOTICE.md) for the full brand asset model and the BSA
Brand Center license terms that govern asset use.

## Fonts

The system uses **Montserrat** (display) and **Source Serif 4** (body), both
SIL Open Font License. Per program, the display weight ranges from 600 (Sea
Scouts) to 900 (Cub Scouts), which is why both fonts are loaded as **variable
fonts**: one file per Unicode subset covers every weight.

### This repo: self-hosted (no runtime CDN)

The demo and Storybook self-host the fonts via
[Fontsource](https://fontsource.org/). There is no third-party request at
runtime: no jsDelivr, no Google Fonts, no tracking, offline-capable, and CSP
friendly. The faces are pulled in with plain JS imports at each entry point
(`demo/main.tsx` and `.storybook/preview.tsx`):

```ts
import "@fontsource-variable/montserrat";
import "@fontsource-variable/montserrat/wght-italic.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
```

The two `@fontsource-variable` packages are `devDependencies`: they are
consumed by the demo and Storybook, so the built library CSS (`dist/styles.css`)
deliberately does not inline any font faces.

### Library consumers: bring your own fonts

Because the published stylesheet does not bundle font faces, a consumer of
`@opensourcescouting/design-system` must load the two families themselves. The
simplest route is to install the same packages and import them at your app
entry:

```bash
npm i @fontsource-variable/montserrat @fontsource-variable/source-serif-4
```

```ts
import "@fontsource-variable/montserrat";
import "@fontsource-variable/montserrat/wght-italic.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
```

Any equivalent delivery works too (a `@font-face` block, Google Fonts, a CDN of
your choosing) as long as it registers faces under the exact family names
`"Montserrat Variable"` and `"Source Serif 4 Variable"`, which is what
`tokens.css` references. If those faces are absent the components still render,
falling back to the platform system fonts.

For a copy-pasteable app entry that wires up the four imports with zero
third-party requests, see [`examples/self-host-fonts/`](./examples/self-host-fonts/).

## Icons

The recommended icon set is [Lucide](https://lucide.dev) (ISC-licensed). The
library depends on `lucide-react` and uses it internally, so it is already
installed for you. We deliberately do **not** re-export a bundled icon catalog:
Lucide is tree-shakeable, so importing glyphs directly means you ship only the
ones you use.

Use the `Icon` primitive to render any Lucide glyph with the system's sizing,
stroke, `currentColor` tinting, and accessibility conventions:

```tsx
import { Icon } from "@opensourcescouting/design-system";
import { Compass, Rocket } from "lucide-react";

<Icon icon={Compass} className="text-primary" />   // decorative (aria-hidden)
<Icon icon={Rocket} label="Launch" />                       // meaningful (role="img")
```

Icons default to **decorative** (`aria-hidden`), which is correct when they sit
next to a text label. Pass `label` only when the icon is the sole conveyer of
meaning (e.g. an icon-only button).

`ProgramIcon` is a preset built on `Icon` that renders a trademark-safe symbol
for the active program (paw print, tent, mountain, anchor). It is meaningful by
default (labeled with the program name); pass `ariaLabel=""` to make it
decorative. See also `ProgramMark` for the official brand marks.

```tsx
import { ProgramIcon } from "@opensourcescouting/design-system";

<ProgramIcon />                       // symbol for the active program theme
<ProgramIcon program="venturing" />   // pinned to one program
```

Bring your own icon library instead if you prefer: nothing forces Lucide on your
own UI. `Icon` simply standardizes the Lucide path when you want consistency
with the design system's components.

## Forms

The form layer is built on native inputs (accessible, mobile-friendly, no JS
needed) styled with the program tokens. `Field` is the foundation: it renders a
label, help text, and error, and wires `id` / `aria-describedby` / `aria-invalid`
onto the control inside it automatically.

```tsx
import {
  Field,
  TextInput,
  Textarea,
  Select,
  SelectItem,
  NativeSelect,
  Checkbox,
  Switch,
  RadioGroup,
  Radio,
} from "@opensourcescouting/design-system";

<Field label="Email" help="For event reminders." error={errors.email} required>
  <TextInput type="email" name="email" />
</Field>

<Checkbox label="I have read the health form" />
<Switch label="Email me reminders" defaultChecked />

<RadioGroup label="Shirt size" defaultValue="m">
  <Radio value="s" label="Small" />
  <Radio value="m" label="Medium" />
</RadioGroup>
```

`Field` handles the label-above controls (`TextInput`, `Textarea`, `Select`).
`Checkbox` and `Switch` are self-labeled (label beside the control), and
`RadioGroup` renders a proper fieldset/legend group. Invalid state is inferred
from a `Field`'s `error`, or forced with the `invalid` prop on a bare control.

Two selects ship: **`Select`** is the themed dropdown (built on Radix, its open
list wears the program surface; pass `SelectItem` children) and requires a
`ScoutThemeProvider`; **`NativeSelect`** is the zero-JS native `<select>` (takes
`<option>` children) whose popup is OS-rendered but works everywhere including
mobile.

```tsx
<Select defaultValue="cub" onValueChange={setProgram}>
  <SelectItem value="cub">Cub Scouts</SelectItem>
  <SelectItem value="scoutsbsa">Scouts BSA</SelectItem>
</Select>
```

Richer inputs (Combobox/autocomplete, a Calendar-backed date picker, file
upload) are planned; see `docs/TODO.md`.

## Scouting resource links

To keep every site pointing at the same authoritative URLs (instead of drifting,
hand-typed copies), the package ships a small versioned data module of canonical
Scouting America links:

```tsx
import { SCOUTING_LINKS, SCOUTING_LINK_LIST } from "@opensourcescouting/design-system";

<a href={SCOUTING_LINKS.beAScout.url}>{SCOUTING_LINKS.beAScout.label}</a>;

// or render a footer group from the list
SCOUTING_LINK_LIST.map((l) => (
  <a key={l.url} href={l.url}>
    {l.label}
  </a>
));
```

Includes Scouting America, BeAScout, the Guide to Safe Scouting, and Safeguarding
Youth training. These are official **external** resources; this project is not
affiliated with Scouting America (see `NOTICE.md`), and linking does not imply
endorsement. URLs are treated as versioned data: when one changes it is updated
here and noted in the `CHANGELOG.md`.

## Accessibility

- Focus rings use `--ring`, always visible (2px solid, 2px offset)
- Color pairings tested against WCAG 2.1 AA (the accessibility contrast bar most compliance policies require) for body text and large text
- `prefers-reduced-motion` suppresses non-essential animation globally; the Button press translation uses `motion-safe:active:` so it never fires under reduced motion
- All decorative SVG is `aria-hidden`; informative SVG has `aria-label`
- Headings use semantic `<h1>`-`<h6>` independently of visual size
- `Button` with `variant="accent"` and `size="sm"` is excluded at the TypeScript type level; the gold accent fill does not pass WCAG AA at 12px. A dev-mode console warning catches untyped call sites.
- `tokens.css` includes a `forced-colors: active` block for Windows High Contrast mode. It zeroes shadows, adds a `ButtonText` border to every button, and routes focus to the system `Highlight` pair so keyboard position is always visible regardless of program ring color.

## Scripts

| Command                   | Description                                                                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Vite dev server, runs the `demo/App.tsx` showcase at port 5173.                                                                                                                                                      |
| `npm run storybook`       | Storybook 10 component explorer at port 6006.                                                                                                                                                                        |
| `npm run build`           | `tsc -b && vite build && npm run build:css` (library dist + CSS artifacts).                                                                                                                                          |
| `npm run build:demo`      | Build the SPA showcase (copies public assets; for deployment).                                                                                                                                                       |
| `npm run build:css`       | Re-emit dist/styles.css and dist/tokens.css only.                                                                                                                                                                    |
| `npm run typecheck`       | `tsc --noEmit` across three configs (project, node, and test tsconfig files).                                                                                                                                        |
| `npm run test`            | Vitest, two projects: a jsdom "unit" project (contrast, token parity, component behavior/logic) and a real-Chromium "storybook" project that runs every story with an axe a11y pass (via `@storybook/addon-vitest`). |
| `npm run build-storybook` | Static Storybook build for deployment.                                                                                                                                                                               |
| `npm run lint`            | Prettier formatting check (run in CI).                                                                                                                                                                               |
| `npm run format`          | Prettier auto-fix across the repo.                                                                                                                                                                                   |
| `npm run clean`           | Remove build output (dist, storybook-static, caches, tsbuildinfo).                                                                                                                                                   |
| `npm run maintenance:git` | Prune unreachable objects to shrink `.git` (safe; reachable history intact).                                                                                                                                         |

The "storybook" Vitest project runs stories in real Chromium, so running
`npm run test` locally requires a one-time `npx playwright install chromium`
first.

## Getting help

- **Something not working, or a bug?** Open an issue:
  [github.com/opensourcescouting/design-system/issues](https://github.com/opensourcescouting/design-system/issues).
  A bug-report template is provided.
- **Want a new component or feature?** File a feature-request issue with the
  use case.
- **Contributing code?** Read [`CONTRIBUTING.md`](./.github/CONTRIBUTING.md)
  first (setup, conventions, and the changeset requirement).
- **Found a security issue?** Do not open a public issue; follow
  [`SECURITY.md`](./.github/SECURITY.md).

## License & trademark notice

- **Software** (React components, tokens, styles, build config, placeholder
  graphics): MIT; see [`LICENSE`](./LICENSE). Reuse it for your own pack,
  troop, crew, ship, council, or any other context.
- **Official Scouting America / BSA brand assets** (real logos,
  fleur-de-lis, program marks): governed by the BSA Brand Center license,
  not this MIT License. Real assets are never committed to this repository;
  each user downloads them under their own eligibility. See
  [`NOTICE.md`](./NOTICE.md) for the deployment workflow and rules.

Scouting America trademarks, including the fleur-de-lis, "Be Prepared," and
program names, are protected by a 1916 Act of Congress (36 U.S.C. 27) and
USPTO registrations.
