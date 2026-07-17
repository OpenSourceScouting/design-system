# Scouting America Design System: Claude Context

React + Tailwind component library for Scouting America's parent brand and four
program sub-brands (Cub Scouts, Scouts BSA, Venturing, Sea Scouts). Built from
the official 2024 Brand Guidelines (`research/scouting-america-brand-guidelines-2024.pdf`).

## Commands

```bash
npm run dev           # Vite showcase at http://localhost:5173 (demo/App.tsx)
npm run storybook     # Storybook 8 at http://localhost:6006 (component lab)
npm run typecheck     # tsc --noEmit, three configs: project + node + test
npm run test          # Vitest: contrast ratios, axe smoke tests, component unit tests
npm run build         # tsc -b && vite build && npm run build:css (use to verify final correctness)
npm run build-storybook
```

Node >=22, npm >=10. CI and `.nvmrc` pin the Node 22 LTS; developing on 22 or
23 both work (22 is the supported target). No pnpm. Restart Storybook after `.storybook/*` edits (HMR
does not cover preview/main config).

## Theming architecture (the most important thing)

Theming is **CSS-variable-driven**, selected by the `data-program` attribute.
Tailwind utilities like `bg-program-primary` resolve to `rgb(var(--program-primary))`.

- Source of truth: `src/styles/tokens.css` (one `:root` + four `[data-program="..."]` blocks, plus a `forced-colors: active` block for Windows High Contrast)
- Tailwind binding: `tailwind-preset.cjs` `theme.extend.colors.program.*`; `borderWidth.rule` maps `--program-rule-weight` to utilities like `border-b-rule`. `tailwind.config.ts` just consumes the preset and adds local content globs.
- React wrapper: `ScoutThemeProvider` sets the `data-program` attribute **and**
  populates a context. Both are needed.

**`useScoutTheme()` throws if there is no `ScoutThemeProvider` ancestor.** The
addon-themes `withThemeByDataAttribute` decorator only sets the attribute and
will break any component that reads program metadata via context (ProgramHero,
RegistrationCTA, ProgramMark). The Storybook preview (`.storybook/preview.tsx`)
wraps every story in `ScoutThemeProvider` with a `globalTypes.program` toolbar.

## Contrast / accessibility rules

Do **not** use opacity tints below `/80` on text. Tailwind's `text-on-surface/55`
pattern fails WCAG AA at small sizes (composited contrast drops to ~3:1).

Use these tokens instead:

- `text-program-on-surface-soft`: verified ≥4.5:1 (AA body text)
- `text-program-on-surface-faint`: verified ≥3:1 (inactive/dim text)
- `text-program-on-primary-soft`: verified ≥4.5:1 on primary surfaces

`/80` and `/85` opacity tints are safe (composite to ~9:1) and remain in use
for hierarchy where a dedicated token would over-engineer.

## Brand asset model (legal-sensitive)

**Real BSA brand assets are gitignored. Do not commit them.** The repo ships
with placeholder marks drawn inline in `src/components/ProgramMark.tsx`;
those are our original work, not BSA trademarks.

- Assets live in `public/marks/`; SVG/PNG/JPG/WebP all supported via extension fallback
- `ProgramMark` loads `/marks/{program}[-variant].{ext}` and falls back to placeholders
- Asset path is configurable: `<ProgramMark basePath>` > `<ScoutThemeProvider marksBasePath>` > `VITE_MARKS_BASE_URL` env var > `/marks/`
- **Do NOT apply `text-*` color utilities to real assets.** The `<img>` for color/reversed variants renders the file's pixels unchanged; recoloring is a derivative work and the BSA license forbids it. The `mono` variant alone permits "any dark color."
- Use `variant="reversed"` on dark `bg-program-primary` surfaces (EventDialog header, RegistrationCTA), `variant="mono"` for watermarks
- See `LICENSE` (MIT for code, NOTICE for asset model) and `NOTICE.md` for the full deployment workflow

## Project structure

```
src/                           ← the published library ONLY
  styles/tokens.css            ← source of truth for design tokens, cite p.# of brand guidelines
  styles/globals.css           ← Tailwind layers + font imports
  lib/theme/ScoutThemeProvider ← context + data-attribute, exports normalizeBasePath
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

## Planned re-platform (read before large changes)

ADR 0002/0003 (`docs/decisions/`) commit the project to shadcn/ui patterns on
Tailwind v4, executed via `docs/shadcn-migration-plan.md`. Until that migration
lands, the conventions below describe the CURRENT code; new work should avoid
deepening deltas the migration will remove (see the delta register in ADR 0002).

## Conventions specific to this codebase

- One typography pair across all programs (Montserrat display, Source Serif 4 body)
- Per-program differentiation lives in CSS-var overrides only, never in component code
- `CardEyebrow` uses `border-b-rule` for its bottom keyline; the weight tracks `--program-rule-weight` per program (3px Cub, 2px Scouts BSA + Venturing, 1px Sea Scouts)
- `Card featured` prop promotes to raised surface + inset hairline ring; pair with `CardEyebrow` for a "lead story" layout
- `CalendarEvent.featured` renders the program's `DecorativeDivider` motif at the top of the agenda item and increases the title size
- Calendar falls back to agenda view below 640px (month cells need ~88px per column to be usable); the Month toggle is hidden in that state via `showToggle={!narrow}`
- `Button variant="accent" size="sm"` is excluded at the TypeScript type level (gold at 12px fails WCAG AA); a dev-mode `console.warn` catches untyped call sites
- `ScoutThemeProvider applyToDocument` applies `data-program` to `<html>` via `useEffect` with cleanup; unmounting or changing `program` restores the previous value on the element
- Calendar is built without date-fns (vanilla `Date` math in `lib/utils/date.ts`)
- EventDialog uses native `<dialog>` + `.showModal()` for built-in focus trap; backdrop click closes via `e.target === ref.current` check
- All components support theme nesting (a Venturing card inside a Scouts BSA page works)

## Things to avoid

- Class-based theming (`.theme-cub`). The system uses `[data-program]` so context cascades through portals/dialogs correctly.
- Adding `date-fns` / `dayjs`. Calendar math is ~15 lines of vanilla `Date`.
- Recoloring official marks via CSS. See "Brand asset model."
- Committing files under `public/marks/`. The `.gitignore` blocks it; do not whitelist exceptions beyond `README.md`.
- Opacity-tinted text below `/80`. Use `-soft` / `-faint` tokens.
- `variant="accent" size="sm"` on `Button`. The type system blocks it, but untyped call sites still get a dev-mode console warning. Gold fill at 12px fails WCAG AA.
