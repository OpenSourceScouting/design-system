# Open Source Scouting Design System: Claude Context

React + Tailwind component library that themes the Scouting America parent brand
and four program sub-brands (Cub Scouts, Scouts BSA, Venturing, Sea Scouts).
Built from the official 2024 Brand Guidelines
(`research/scouting-america-brand-guidelines-2024.pdf`). This is a community
project by Open Source Scouting: it is not affiliated with, endorsed by, or
sponsored by Scouting America (see `NOTICE.md` and the README notice).

Built on shadcn/ui patterns (Radix + Tailwind + `cn` + `cva`) on Tailwind v4,
per ADR 0002 and 0003. The guiding rule is to minimize and codify the deltas
from stock shadcn: see the delta register in `docs/decisions/0002-adopt-shadcn-patterns.md`.

## Commands

```bash
npm run dev           # Vite showcase at http://localhost:5173 (demo/App.tsx)
npm run storybook     # Storybook 10 at http://localhost:6006 (component lab)
npm run typecheck     # tsc --noEmit, three configs: project + node + test
npm run test          # Vitest, two projects: jsdom "unit" (contrast, parity, component logic) + browser "storybook" (stories-as-tests + axe in Chromium; needs `npx playwright install chromium`)
npm run build         # tsc -b && vite build && npm run build:css (use to verify final correctness)
npm run build-storybook
```

Node >=22, npm >=11 (Node 22 ships npm 10, so upgrade with `npm i -g npm@11`; a
`preinstall` guard in `scripts/check-npm-version.mjs` blocks older npm, and CI
upgrades npm before every install). npm 11 is required because npm 10 has a
lockfile bug (npm/cli#4828) that drops platform-specific native bindings (e.g.
oxc-resolver's `linux-x64-gnu`) when the lock is regenerated on one platform,
breaking `npm ci` elsewhere. CI and `.nvmrc` pin the Node 22 LTS (the supported
target). Use Node 22 or 24: Vitest 4 requires `^20 || ^22 || >=24`, so Node 23
is unsupported (tests warn EBADENGINE and may not run). No pnpm. Restart
Storybook after `.storybook/*` edits (HMR does not cover preview/main config).

## Theming architecture (the most important thing)

Theming is CSS-variable-driven, selected by the `data-program` attribute.
Tailwind utilities like `bg-primary` resolve to `rgb(var(--primary))`, and the
active `[data-program]` block re-binds that variable, so one utility renders all
five programs with no per-component branching. This is shadcn's `:root` + `.dark`
model with `.dark` replaced by five `[data-program]` blocks.

- Token values: `src/styles/tokens.css` (one `:root` parent brand + four
  `[data-program="..."]` blocks + a `forced-colors: active` block for Windows
  High Contrast). Cite brand-guideline page numbers in comments.
- Tailwind binding: `src/styles/theme.css` (`@theme inline` maps token variables
  to utilities; `@utility border-rule/-b/-t` for the keyline width; the base
  layer). Shipped as the `./theme` export. There is no `tailwind.config.js` and
  no JS preset; v4 is configured in CSS.
- Two entry stylesheets share `tokens.css` + `theme.css`: `globals.css`
  (dev/Storybook/demo, broad source scan) and `library.css` (published, scoped
  to `src/` via `source(none)` + `@source`). `scripts/build-css.mjs` builds
  `library.css` into `dist/styles.css`.
- React wrapper: `ScoutThemeProvider` sets `data-program` and populates a
  context. Both are needed.

Token vocabulary:

- shadcn semantic tokens: `--background`, `--foreground`, `--card`, `--popover`,
  `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`,
  `--input`, `--ring`, `--radius` (plus `-foreground` pairs).
- `--os-*` extended tokens for what shadcn lacks: `--os-accent` (the BRAND
  accent), `--os-accent-foreground`, `--os-on-primary-soft`,
  `--os-on-surface-faint`, `--os-decor`, `--os-rule-weight`, `--os-shadow`,
  `--os-display-*`, and the shared `--os-font-*` pair (`:root`-only).

**Delta 4 (the important trap):** shadcn `--accent` is the muted hover wash
(menus, hover states), NOT the brand accent. The brand accent (gold/yellow/red)
is `--os-accent`. Use `bg-os-accent` for a branded pop; `bg-accent` renders the
wash. A stock shadcn block that uses `bg-accent` as a highlight will look muted,
not branded.

**`useScoutTheme()` throws if there is no `ScoutThemeProvider` ancestor.** The
Storybook preview (`.storybook/preview.tsx`) wraps every story in
`ScoutThemeProvider` with a `globalTypes.program` toolbar.

**Portalled widgets must re-stamp `data-program` (delta 9).** Radix portals
render at `document.body`, outside the themed subtree. Spread `useProgramStamp()`
onto every portalled `*.Content` (Dialog, Popover, DropdownMenu, Tooltip,
Select). The helper is in `ScoutThemeProvider`; use it so the stamp is not
forgotten.

## Contrast / accessibility rules

Do not use opacity tints below `/80` on text; the composited contrast drops
toward 3:1 and fails WCAG AA at small sizes. Use these tokens instead:

- `text-muted-foreground`: verified >=4.5:1 (AA muted body text)
- `text-os-on-surface-faint`: verified >=3:1 (inactive/dim text)
- `text-os-on-primary-soft`: verified >=4.5:1 on primary surfaces

`/80` and `/85` tints are safe and stay in use for hierarchy. The contrast test
(`tests/contrast.test.ts`) verifies the base token pairs AND the `/80` and `/85`
composites over each program surface. `tests/token-parity.test.ts` verifies
every program block defines an identical token set.

## Brand asset model (legal-sensitive)

**Real BSA brand assets are gitignored. Do not commit them.** The repo ships
with placeholder marks drawn inline in `src/components/ProgramMark.tsx`;
those are our original work, not BSA trademarks.

- Assets live in `public/marks/`; SVG/PNG/JPG/WebP all supported via extension fallback
- `ProgramMark` loads `/marks/{program}[-variant].{ext}` and falls back to placeholders
- Asset path is configurable: `<ProgramMark basePath>` > `<ScoutThemeProvider marksBasePath>` > `VITE_MARKS_BASE_URL` env var > `/marks/`
- **Do NOT apply `text-*` color utilities to real assets.** The `<img>` for color/reversed variants renders the file's pixels unchanged; recoloring is a derivative work and the BSA license forbids it. The `mono` variant alone permits "any dark color."
- Use `variant="reversed"` on dark `bg-primary` surfaces (EventDialog header, RegistrationCTA), `variant="mono"` for watermarks
- See `LICENSE` (MIT for code, NOTICE for asset model) and `NOTICE.md` for the full deployment workflow

## Project structure

```
src/                           ← the published library ONLY
  styles/tokens.css            ← token values per program, cite p.# of brand guidelines
  styles/theme.css             ← v4 @theme mapping + @utility + base layer (the ./theme export)
  styles/globals.css           ← dev/Storybook/demo entry (tailwindcss + tokens + theme)
  styles/library.css           ← published entry (scoped source scan) -> dist/styles.css
  lib/theme/ScoutThemeProvider ← context + data-attribute; exports useProgramStamp, normalizeBasePath
  lib/utils/{cn,date}          ← tiny helpers (no date-fns / dayjs dependency)
  components/                  ← one file per component, .stories.tsx alongside
  stories/                     ← Introduction.mdx + Colors.stories.tsx (cross-component)
  index.ts                     ← public package entry (barrel)
demo/                          ← dev-only showcase; Vite root for `dev` + `build:demo`, NOT published
  index.html  main.tsx  App.tsx  (App imports the library via the `@` alias)
.storybook/preview.tsx         ← MUST wrap stories in ScoutThemeProvider
public/                        ← served assets: marks/ (gitignored), oss/ (logos), favicons
research/                      ← brand guidelines PDF + extracted text
```

## Conventions specific to this codebase

- Components use the `cva` recipe idiom for variants (see `Button`, `Badge`,
  `Card`). Colors resolve to the shadcn / `--os-*` tokens.
- One typography pair across all programs (Montserrat display, Source Serif 4
  body). UI chrome uses `font-display` / the `.display` helper; body copy uses
  `font-body`.
- Per-program differentiation lives in CSS-var overrides only, never in
  component code.
- Radius: the system uses one radius per program. Use `rounded-lg`
  (`= --radius`); the `rounded-program` alias still resolves to the same value.
  The `--radius-sm/md/lg/xl` scale exists for recipes that want it, but our
  primitives keep the single brand radius (Sea Scouts stays hairline).
- `CardEyebrow` uses `border-b-rule` for its bottom keyline; the weight tracks
  `--os-rule-weight` per program (3px Cub, 2px Scouts BSA + Venturing, 1px Sea Scouts).
- `Card featured` promotes to raised surface + inset hairline ring; pair with `CardEyebrow` for a "lead story" layout.
- Form layer keeps the framework-agnostic `Field` context (id / describedBy /
  invalid / required / disabled). shadcn's `Form` (react-hook-form) is NOT
  adopted; see delta 10. Validation uses `border-destructive` / `text-destructive`.
- `Button variant="accent" size="sm"` is excluded at the TypeScript type level
  (gold at 12px fails WCAG AA); a dev-mode `console.warn` catches untyped call sites (delta 5).
- `CalendarEvent.featured` renders the program's `DecorativeDivider` motif and increases the title size.
- Calendar falls back to agenda view below 640px (`showToggle={!narrow}`), built without date-fns (vanilla `Date` math in `lib/utils/date.ts`).
- `EventDialog` is built on the shadcn `Dialog` recipe (Radix); Radix supplies the focus trap, ESC, inert background, overlay, and the delta-9 re-stamp. The native `<dialog>` implementation was retired.
- Status colors (Alert tones) come from the raw `sa-*` palette, not program tokens: system feedback reads the same across programs.
- All components support theme nesting (a Venturing card inside a Scouts BSA page works).
- Adding a program is additive: add a `[data-program]` block to `tokens.css` with
  the full token set (the parity test enforces an identical set), add it to
  `PROGRAMS` / `PROGRAM_META` in `ScoutThemeProvider`, and to the `PALETTES`
  arrays in the token tests. No component code changes.

## Testing

- `npm test` runs Vitest with two projects (see `vitest.config.ts`):
  - **`unit`** (jsdom): `tests/contrast.test.ts` (WCAG ratios per program,
    including the `/80` and `/85` composites over each surface),
    `tests/token-parity.test.ts` (per-program token-set parity), and per-component
    smoke + behavior tests (non-a11y logic). This is the sub-3s inner loop; run
    just it with `npx vitest --project unit`. It does NOT run axe (retired: the
    browser project is the single a11y source, see ADR 0005).
  - **`storybook`** (browser): every story runs as a test in real Chromium via
    `@storybook/addon-vitest`, with an axe pass per story. Needs Playwright
    Chromium (`npx playwright install chromium`). Run just it with
    `npx vitest --project=storybook`.
  - Every new component needs a **story** (that is the required a11y coverage);
    a jsdom `unit` test is for non-a11y logic and is optional for a11y. Use story
    `play` functions to assert focus/keyboard behavior on interactive widgets.
- Radix portalled widgets (Popover, Tooltip, DropdownMenu, Select) need the jsdom
  stubs in `tests/setup.ts` (ResizeObserver, scrollIntoView, pointer-capture) to
  render in the jsdom `unit` project (open with `defaultOpen`, scan
  `document.body`; see `widgets.test.tsx`). The jsdom project no longer runs axe;
  a11y for these widgets is covered by their stories in the browser project.
- Accessibility testing strategy: ADR 0005. Two contrast layers: token soundness
  in `contrast.test.ts` (all five palettes), and rendered-contrast application in
  `src/stories/ContrastKitchenSink.stories.tsx` (color-contrast re-enabled there
  across programs). Semantics run via `@storybook/addon-vitest`
  (`parameters.a11y.test = "error"` in `.storybook/preview.tsx`, so violations
  fail CI) with `color-contrast` DISABLED there on purpose. Do not re-enable
  `color-contrast` globally; it is deferred to the token test and the kitchen-sink
  story. Per-story a11y opt-out is `parameters: { a11y: { test: "off" } }`.
- Visual regression is RETIRED and parked (the `@storybook/test-runner` +
  jest-image-snapshot pipeline was removed in the Storybook 10 upgrade; baselines
  were deleted and purged from history). For now, eyeball changes in
  `npm run storybook` across the program toolbar. See
  `.storybook/VISUAL_REGRESSION.md` to rebuild it later.

## Things to avoid

- Class-based theming (`.theme-cub`). The system uses `[data-program]` so context cascades through portals/dialogs correctly.
- `bg-accent` for a brand pop. That is the muted hover wash (delta 4); use `bg-os-accent`.
- Forgetting `useProgramStamp()` on a new portalled widget's content (delta 9).
- Adding `date-fns` / `dayjs`. Calendar math is ~15 lines of vanilla `Date`.
- Recoloring official marks via CSS. See "Brand asset model."
- Committing files under `public/marks/`. The `.gitignore` blocks it; do not whitelist exceptions beyond `README.md`.
- Opacity-tinted text below `/80`. Use the `-muted-foreground` / `-os-on-surface-faint` tokens.
- `variant="accent" size="sm"` on `Button`. The type system blocks it, but untyped call sites still get a dev-mode console warning.
- Reintroducing a `tailwind.config.js` or JS preset. v4 is configured in CSS (`theme.css`).
- Bundling a new runtime dependency without deciding externalization. `radix-ui`,
  `sonner`, `lucide-react`, and React are externalized in `vite.config.ts`
  (`rollupOptions.external` + `globals`); `clsx`, `tailwind-merge`, and `cva` are
  bundled. A new runtime dep needs an explicit externalize-or-bundle choice there.
