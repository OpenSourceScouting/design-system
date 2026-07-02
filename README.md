# Scouting America Design System

A React + Tailwind component library for the Scouting America parent brand and
its four program sub-brands: **Cub Scouts**, **Scouts BSA**, **Venturing**, and
**Sea Scouts**.

Built directly from the [Scouting America 2024 Brand Guidelines](https://pathwaytoadventure.org/wp-content/uploads/2024/05/Scouting-America-Brand-Guidelines-2024-BC.pdf).

Not using React? [`BRAND-GUIDE.md`](./BRAND-GUIDE.md) is a self-contained
brand reference (colors, type, voice, print values, trademark rules) that you
or any AI tool can use to produce on-brand scouting materials without this
codebase.

## Quick start

```bash
npm install
npm run dev        # interactive showcase at http://localhost:5173
npm run storybook  # component explorer at http://localhost:6006
```

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
`tailwind.config.ts`. The vars get re-bound by selecting an ancestor with the
right `data-program="..."` attribute.

```tsx
import { ScoutThemeProvider, Button } from "./src";

<ScoutThemeProvider program="venturing">
  <Button variant="primary">Charge ahead</Button>
</ScoutThemeProvider>
```

You can nest providers; a Venturing card on a Scouts BSA page is supported.

## Programs at a glance

| Program     | Primary    | Accent     | Personality                              |
| ----------- | ---------- | ---------- | ---------------------------------------- |
| Cub Scouts  | `#003F87`  | `#FDC116`  | Rounded, bold, warm. Display weight 900. |
| Scouts BSA  | `#243E2C`  | `#003F87`  | Crisp, traditional. Display weight 700.  |
| Venturing   | `#006B3F`  | `#FCD116`  | Sharp, BOLD UPPERCASE. Display weight 800. |
| Sea Scouts  | `#003366`  | `#FFCC00`  | Linear, italic editorial. Weight 600.    |

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

### Default: jsDelivr (zero install)

Out of the box, `src/styles/globals.css` imports the variable fonts from
jsDelivr's mirror of [Fontsource](https://fontsource.org/):

```
https://cdn.jsdelivr.net/npm/@fontsource-variable/montserrat@5/index.css
https://cdn.jsdelivr.net/npm/@fontsource-variable/source-serif-4@5/index.css
```

No third-party tracking (unlike Google Fonts), Latin subset only for English
content (via `unicode-range`), and pinned to the `@5` major so patch releases
roll forward without breaking changes.

### Advanced: self-host

If you want zero third-party requests at runtime (recommended for production
council deployments, offline-capable builds, or strict CSP):

```bash
npm i @fontsource-variable/montserrat @fontsource-variable/source-serif-4
```

Then in your app entry:

```ts
import "@fontsource-variable/montserrat";
import "@fontsource-variable/montserrat/wght-italic.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
```

…and remove the four `@import url(...)` lines at the top of
`src/styles/globals.css`. The font-family names (`"Montserrat Variable"`,
`"Source Serif 4 Variable"`) are identical in both modes, so `tokens.css`
needs no change.

## Accessibility

- Focus rings use `--program-ring`, always visible (2px solid, 2px offset)
- Color pairings tested against WCAG 2.1 AA for body text and large text
- `prefers-reduced-motion` suppresses non-essential animation globally; the Button press translation uses `motion-safe:active:` so it never fires under reduced motion
- All decorative SVG is `aria-hidden`; informative SVG has `aria-label`
- Headings use semantic `<h1>`–`<h6>` independently of visual size
- `Button` with `variant="accent"` and `size="sm"` is excluded at the TypeScript type level; the gold accent fill does not pass WCAG AA at 12px. A dev-mode console warning catches untyped call sites.
- `tokens.css` includes a `forced-colors: active` block for Windows High Contrast mode. It zeroes shadows, adds a `ButtonText` border to every button, and routes focus to the system `Highlight` pair so keyboard position is always visible regardless of program ring color.

## Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Vite dev server, runs the App.tsx demo.  |
| `npm run storybook`    | Storybook 8 at port 6006.                |
| `npm run build`        | Type-check and build production assets.  |
| `npm run typecheck`    | Type-check without emitting.             |
| `npm run build-storybook` | Static Storybook for deploy.          |

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
