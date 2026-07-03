# Scouting America Design System

A React + Tailwind component library for the Scouting America parent brand and
its four program sub-brands: **Cub Scouts**, **Scouts BSA**, **Venturing**, and
**Sea Scouts**.

Built directly from the [Scouting America 2024 Brand Guidelines](https://pathwaytoadventure.org/wp-content/uploads/2024/05/Scouting-America-Brand-Guidelines-2024-BC.pdf).

> **Community project:** This library is built and maintained by registered
> Scouting volunteers. It is not an official Scouting America product and is
> not affiliated with, endorsed by, or sponsored by Scouting America or the
> Boy Scouts of America. The `@openscouting` package scope reflects that
> community status. Official BSA brand assets remain governed by the BSA
> Brand Center license (see `NOTICE.md`).

Not using React? [`BRAND-GUIDE.md`](./BRAND-GUIDE.md) is a self-contained
brand reference (colors, type, voice, print values, trademark rules) that you
or any AI tool can use to produce on-brand scouting materials without this
codebase.

## Which document do I need?

| I am...                                      | Start here                          |
| -------------------------------------------- | ----------------------------------- |
| A developer installing the package           | This README (you are here)          |
| A designer, marketer, or AI tool             | [`BRAND-GUIDE.md`](./BRAND-GUIDE.md) |
| Checking trademark or asset license rules    | [`NOTICE.md`](./NOTICE.md)          |
| Picking up a backlog task to contribute      | [`TODO.md`](./TODO.md)              |
| A coding agent working inside this codebase  | [`CLAUDE.md`](./CLAUDE.md)          |

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
npm install @openscouting/design-system
```

Or directly from a packed tarball during early adoption:

```bash
npm install ./openscouting-design-system-0.1.0.tgz
```

**Supported React versions:** React 18 and React 19 (peer dependency `react >= 18`).
React and react-dom are peers; they must already be in your project.

### Wire up Tailwind

Add the preset to your `tailwind.config.ts` (or `.js`). This injects all program
color tokens, typography utilities, and shadow/radius/border tokens:

```ts
// tailwind.config.ts
import scoutingPreset from "@openscouting/design-system/tailwind-preset";

export default {
  presets: [scoutingPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    // include the package's own components so Tailwind sees their class names
    "./node_modules/@openscouting/design-system/dist/**/*.js",
  ],
};
```

### Import the styles

Import the compiled stylesheet once, at your app entry point:

```ts
// main.tsx (or index.ts, _app.tsx, etc.)
import "@openscouting/design-system/styles";
```

If you need only the raw CSS custom property definitions without the Tailwind
utilities (useful for non-Tailwind projects), import the tokens file instead:

```ts
import "@openscouting/design-system/tokens";
```

> **What `@openscouting/design-system/styles` contains (and does not contain):**
> The published stylesheet includes only the Tailwind utility classes that the
> design system's own components use internally. It does **not** run a full
> Tailwind build over your project's source files. This means:
>
> - Utilities you write yourself (`bg-program-primary`, `font-display`,
>   `text-program-on-surface`, etc.) will **not** be emitted by this stylesheet.
> - You need a Tailwind build in your own project that loads the preset, with the
>   standard `@tailwind base; @tailwind components; @tailwind utilities;`
>   directives in your entry CSS.
>
> Example `src/index.css` for a consumer that writes its own Tailwind utilities:
>
> ```css
> @tailwind base;
> @tailwind components;
> @tailwind utilities;
> ```
>
> If you are using Tailwind only to render design system components (no custom
> utilities in your own code), importing `@openscouting/design-system/styles` is
> sufficient and you do not need a separate Tailwind build step.

### Minimal working snippet

```tsx
import { ScoutThemeProvider, Button } from "@openscouting/design-system";

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

### Override colors for your council

Every program color is a CSS custom property carrying a space-separated RGB
triplet (no `rgb()` wrapper). You can override any token by targeting the
`[data-program]` attribute in your own stylesheet:

```css
/* council.css -- override Cub Scouts accent to your council color */
[data-program="cub"] {
  --program-accent: 13 115 119; /* R G B, no commas (example: a council teal) */
}
```

Avoid red as an override on scout-facing surfaces: red is the parent brand's
accent and doubles as the unthemed fallback (see below), so a red accent
reads as either an error state or a broken theme.

The space-separated format is required because Tailwind appends an opacity
modifier at compile time: `bg-program-accent/80` becomes
`rgb(var(--program-accent) / 0.8)`. If you use `rgb(220, 38, 38)` the
opacity modifier breaks.

Full list of overridable tokens is in `src/styles/tokens.css` (shipped as
`dist/tokens.css` in the package).

Troubleshooting tell: if accent buttons render RED on a page you expected
gold, your theming is not wired up. The `:root` fallback palette is the
parent Scouting America brand, whose accent is SA Red (#CE1126), so a red
accent means the element has no `data-program` ancestor (missing
`ScoutThemeProvider`) or the token CSS never loaded.

### Serve program marks from a subpath

By default, `ProgramMark` loads files from `/marks/` on the same origin. If
your app is deployed at a subpath (for example `https://pack42.org/events/`)
or you host assets on a CDN, set the base path in one of three ways:

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
import { EventCard } from "@openscouting/design-system";

function MyPage() {
  const navigate = useNavigate();
  return (
    <EventCard
      event={event}
      navigate={(url) => navigate(url)}
    />
  );
}
```

When `navigate` is omitted, the components fall back to `window.location.href`
assignment, which works fine for non-SPA deployments.

## Architecture

```
src/
├── styles/
│   ├── tokens.css        # CSS custom properties per program (the source of truth)
│   └── globals.css       # Tailwind layers + font imports + base styles
├── lib/
│   ├── theme/
│   │   └── ScoutThemeProvider.tsx   # React context + data-program attribute
│   └── utils/
│       ├── cn.ts         # clsx + tailwind-merge
│       └── date.ts       # vanilla Date math (no date-fns)
├── components/
│   ├── Button.tsx        # Primitives; variant="accent" size="sm" excluded at the type level (WCAG AA)
│   ├── Card.tsx          # Card, CardBody, CardHeader, CardFooter, CardEyebrow
│   ├── Badge.tsx
│   ├── Heading.tsx
│   ├── Alert.tsx
│   ├── ProgramMark.tsx       # Auto-loads from /marks/, falls back to inline placeholder SVGs
│   ├── ProgramIcon.tsx       # Per-program fallback icons + PROGRAM_ICONS registry
│   ├── ScoutingAmericaWordmark.tsx  # Parent brand wordmark (wide / tall orientations)
│   ├── DecorativeBorder.tsx  # Per-program ornamental divider
│   ├── ProgramHero.tsx       # Marketing patterns
│   ├── FeatureGrid.tsx
│   ├── EventCard.tsx         # Operational program patterns
│   ├── RegistrationCTA.tsx
│   ├── Calendar.tsx          # Month + agenda views; CalendarEvent supports featured
│   └── EventDialog.tsx       # Native <dialog> modal for event detail
└── App.tsx               # End-to-end demo with program switcher
```

## How theming works

Every theme-aware style resolves through a CSS custom property like
`--program-primary`. Tailwind utilities (`bg-program-primary`,
`text-program-on-surface`, etc.) are wired to those vars in
`tailwind-preset.cjs` (the published preset). `tailwind.config.ts` in this
repo just consumes that preset and adds the local content globs. The vars get
re-bound by selecting an ancestor with the right `data-program="..."` attribute.

```tsx
import { ScoutThemeProvider, Button } from "./src";

<ScoutThemeProvider program="venturing">
  <Button variant="primary">Charge ahead</Button>
</ScoutThemeProvider>
```

You can nest providers; a Venturing card on a Scouts BSA page is supported.

## Programs at a glance

| Program     | Primary    | Primary Pantone | Accent     | Accent Pantone | Personality                              |
| ----------- | ---------- | --------------- | ---------- | -------------- | ---------------------------------------- |
| Cub Scouts  | `#003F87`  | PMS 294         | `#FDC116`  | PMS 116        | Rounded, bold, warm. Display weight 900. |
| Scouts BSA  | `#243E2C`  | none listed     | `#003F87`  | PMS 294        | Crisp, traditional. Display weight 700.  |
| Venturing   | `#006B3F`  | PMS 349         | `#FCD116`  | PMS 116        | Sharp, BOLD UPPERCASE. Display weight 800. |
| Sea Scouts  | `#003366`  | none listed     | `#FFCC00`  | none listed    | Linear, italic editorial. Weight 600.    |

Full CMYK and Pantone data (including secondary tans, grays, and mark-reproduction colors) is in [`src/styles/tokens.print.json`](./src/styles/tokens.print.json) and ships in the package at `dist/tokens.print.json`.

### The `sa-red` raw palette utility

`tokens.css` defines a raw Tailwind color `sa-red` (`#CE1126`, Scouting America
Red) as a standalone palette entry alongside the `program-*` token family.
It is **reserved for true error and danger states only**, such as form validation
errors, destructive action confirmations, and alert banners that signal failure.

Do not use `sa-red` as a general accent or brand color on program pages: the
parent brand red reads as either an error state or a broken theme (it is also the
`:root` fallback when no `data-program` ancestor exists). If you need a
program-appropriate accent, use `bg-program-accent` instead.

## Configuring where assets are served from

By default, `<ProgramMark>` loads files from `/marks/`. You can override that
in three places, in priority order (highest wins):

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
(`src/main.tsx` and `.storybook/preview.tsx`):

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
`@openscouting/design-system` must load the two families themselves. The
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

## Accessibility

- Focus rings use `--program-ring`, always visible (2px solid, 2px offset)
- Color pairings tested against WCAG 2.1 AA for body text and large text
- `prefers-reduced-motion` suppresses non-essential animation globally; the Button press translation uses `motion-safe:active:` so it never fires under reduced motion
- All decorative SVG is `aria-hidden`; informative SVG has `aria-label`
- Headings use semantic `<h1>`–`<h6>` independently of visual size
- `Button` with `variant="accent"` and `size="sm"` is excluded at the TypeScript type level; the gold accent fill does not pass WCAG AA at 12px. A dev-mode console warning catches untyped call sites.
- `tokens.css` includes a `forced-colors: active` block for Windows High Contrast mode. It zeroes shadows, adds a `ButtonText` border to every button, and routes focus to the system `Highlight` pair so keyboard position is always visible regardless of program ring color.

## Scripts

| Command                   | Description                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`             | Vite dev server, runs the App.tsx demo at port 5173.                          |
| `npm run storybook`       | Storybook 8 component explorer at port 6006.                                  |
| `npm run build`           | `tsc -b && vite build && npm run build:css` (library dist + CSS artifacts).   |
| `npm run build:demo`      | Build the SPA showcase (copies public assets; for deployment).                |
| `npm run build:css`       | Re-emit dist/styles.css and dist/tokens.css only.                             |
| `npm run typecheck`       | `tsc --noEmit` across three configs (project, node, and test tsconfig files). |
| `npm run test`            | Vitest: contrast-ratio assertions, axe smoke tests, component unit tests.     |
| `npm run build-storybook` | Static Storybook build for deployment.                                        |

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
