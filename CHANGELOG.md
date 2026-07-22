# Changelog

## 0.2.0-alpha.0

### Minor Changes

- 5758896: Calendar ergonomics. `CalendarEvent` gains an `allDay` flag that suppresses the
  time label in agenda rows and month chips (a start-of-day date no longer reads
  as a misleading "12:00 AM"). When the agenda window is empty but events exist
  outside it, the calendar now prompts "Switch to Month view to browse" instead of
  a dead end (hidden on narrow viewports where the month grid is unavailable). A
  new optional `onViewChange` prop reports view changes from the toolbar or the
  prompt. (The agenda window already anchored to today, not `defaultMonth`.)
- 4e49bc3: Layout components respond to their container, not the viewport (Tailwind v4
  container queries, no plugin). `FeatureGrid` now picks its column count from its
  own width, so `columns={4}` in a narrow sidebar collapses to one column even on
  a wide screen. `Calendar` falls back to the agenda view based on its own width
  (a ResizeObserver on the calendar element) rather than the viewport, so a
  calendar in a narrow sidebar on a wide screen still falls back. New
  narrow-container stories demonstrate both.
- 446812f: `ScoutThemeProvider` gains an optional `theme` prop: a custom theme layer
  stamped as `data-theme` alongside `data-program`. The library ships no theme
  values itself (Scouting America has no dark mode; this package aligns to the
  official design system), but a unit or project can now layer one, e.g. dark
  mode, by setting `theme` and supplying `[data-theme]`-scoped token overrides in
  their own CSS. Crucially, `useProgramStamp` re-stamps `data-theme` onto
  portalled widgets, so a custom theme applies inside dialogs, menus, and tooltips
  too, and `applyToDocument` manages it on `<html>`. `useScoutTheme()` exposes the
  active `theme`.
- 50aa43b: Email support. Adds a flat hex stylesheet at the `./email.css` subpath
  (`.{program}-{token}-bg` / `-text` classes, no CSS variables) for HTML email,
  generated from the tokens, plus `examples/email-template/index.html`: a
  table-based, inline-hex email (header band, bulletproof CTA button, footer)
  that marketers can copy and retheme by swapping hex values from
  `tokens.email.json`. New README "Email" section.
- 440aedd: `FeatureGrid` gains an optional `renderFeature(feature, index)` prop that
  replaces the default per-cell card entirely (for teaser tiles, background
  images, "Learn more" links, extra metadata) while keeping the grid layout. The
  default rendering is unchanged when the prop is omitted. The `Feature` type is
  exported for typing the render callback.
- 32a740c: Expose the design tokens as framework-neutral data so non-Tailwind and non-web
  consumers can use the exact brand values without hand-copying hex codes.
  `src/styles/tokens.css` stays the authored source of truth; everything is
  generated from it. Adds a typed `TOKENS` export (mirroring `SCOUTING_LINKS`)
  plus three file artifacts shipped as package subpaths: `./tokens.json` (full
  set, rgb + hex + values), `./tokens.scss` (a Sass color map), and
  `./tokens.email.json` (hex-only, flat, for email tools that cannot use CSS
  variables).
- a0dee50: Per-program motion language. Each program now carries three overridable
  `--os-motion-*` tokens (easing, base duration, fast duration) so personality is
  felt, not just static: Cub Scouts overshoots (bounce), Venturing snaps, Sea
  Scouts glides, Scouts BSA stays steady. They map to `ease-program`,
  `duration-program`, and `duration-program-fast` utilities (Button uses the fast
  pair, Card the base), and are retuned per program by overriding the tokens, like
  colors. `prefers-reduced-motion` still zeroes durations globally.
- 72d30c9: Open the API for third-party extension. `Program` is now
  `KnownProgram | (string & {})`, so a consumer can register a custom program by
  adding a matching `[data-program]` token block, with metadata/icons falling back
  to a sensible default (new `isKnownProgram`, `resolveKnownProgram`, and
  `DEFAULT_PROGRAM` helpers). The component style maps are also exported
  (`buttonVariants`, `badgeVariants`, `cardVariants`, `alertToneStyles`) so
  variants can be extended from a wrapper without forking.
- Rework `ProgramHero` around real consumer use cases, surfaced by the first
  downstream adopter (Open Source Scouting site dogfooding, findings DS-1/DS-2/DS-3):

  - **Program identity block is now opt-in.** The ProgramMark + program label +
    age range header no longer renders unless you pass `showProgramIdentity`
    (default `false`). Most consumers establish their own identity in their
    masthead and do not want the program's injected into their hero. (Breaking:
    set `showProgramIdentity` to restore the old block; the demo/showcase does.)
  - **`showTagline` now defaults to `false`.** A consumer's hero no longer
    displays a Scouting America marketing slogan it did not explicitly request.
    (Breaking: pass `showTagline` to restore it.)
  - **Hero actions honor `href`.** An action with an `href` now renders a real
    anchor styled as a button (correct semantics, works before hydration on
    prerendered/static pages, right/middle-click behave). `onClick`-only actions
    still render a `<button>`; passing both fires `onClick` alongside navigation.
    Previously `href` was typed but silently ignored, so `href`-only actions did
    nothing. The exported `ProgramHeroAction` type names the action shape.

  Also hardens `MadeWithBadge` (DS-5): the badge now sets `width: fit-content`
  so it keeps its pill shape as a direct child of a stretching grid/flex parent
  instead of blowing out to full width.

- 85c0d02: `ProgramMark` gains `src` and `preferExtension` props to control asset
  resolution. `src` renders an explicit URL with no extension probing (the fix
  for SPA-fallback hosts like Netlify/Vercel that return 200 + an app shell for
  missing files, defeating probe-by-error); `preferExtension` tries one extension
  first, cutting the common case from up to five requests to one. A zero natural
  dimension load is now also treated as a miss (so a degenerate 200 falls through
  to the placeholder). README and public/marks/README document the SPA-fallback
  behavior and workarounds. Existing default probing and placeholder fallback are
  unchanged.

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Re-platformed onto shadcn/ui patterns (Radix + `cva` recipes) on Tailwind v4,
  per ADR 0002 and 0003. Components are rebuilt on `cva`; the token layer moved
  from the v3 preset to CSS-first `@theme` in `src/styles/theme.css`.
- Tokens now use shadcn's semantic names (`--primary`, `--background`,
  `--accent`, and so on) plus an `--os-*` set for brand concepts shadcn lacks.
  The brand accent is `--os-accent`; shadcn `--accent` is the muted hover wash.
- New Tier-1 widgets on Radix recipes: Dialog, AlertDialog, DropdownMenu,
  Popover, Tooltip, Tabs, Accordion, NavigationMenu, and Sonner-based `Toaster`.
- `EventDialog` rebuilt on the Dialog recipe; the native `<dialog>` was retired.
- `::selection` uses the program primary (AA-safe) instead of the brand accent.
- The contrast test now also checks the `/80` and `/85` text composites over
  each program surface; a token-parity test guards per-program token sets.

### Removed (breaking, pre-release)

- The Tailwind v3 preset and the `./tailwind-preset` export. Consumers on
  Tailwind v4 import `./tokens` and `./theme` in CSS instead (see README). A new
  `./theme` export ships the `@theme` mapping.
- The legacy `--program-*` CSS variables and the `program-*` Tailwind color
  utilities (`bg-program-primary`, and so on). Use the shadcn tokens
  (`bg-primary`, ...) and `--os-*` for the brand accent, decor, and rule weight.

### Added

- Canonical Scouting America resource links (`SCOUTING_LINKS`) as a versioned
  data module: Scouting America, BeAScout, Guide to Safe Scouting, Safeguarding
  Youth. Update URLs here and note changes in this changelog when they drift.
- Icon system: general `Icon` primitive (Lucide) with `ProgramIcon` as a preset.
- Form layer: `Field`, `TextInput`, `Textarea`, themed `Select` (+ `SelectItem`)
  and native `NativeSelect`, `Checkbox`, `Switch`, `RadioGroup`/`Radio`.
- `MadeWithBadge` attribution badge.
- Adopted `radix-ui` for accessible interactive widgets (Tier 1), starting with
  the themed `Select`.

- Contributor documentation: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `SECURITY.md`, and GitHub issue/PR templates.
- Prettier formatting with a `lint` (check) and `format` (write) script, wired
  into CI, plus an `.editorconfig` kept in sync.
- `engines` field and `.nvmrc` pinning Node 22 LTS.
- `npm run clean` and `npm run maintenance:git` housekeeping scripts.
- Adopted [Changesets](https://github.com/changesets/changesets) for versioning
  and release notes, with a `Release` workflow that opens a version PR and
  publishes to npm on merge. `CONTRIBUTING.md` documents the workflow. Entries
  above predate the adoption; future release notes are generated from changeset
  files under `.changeset/`.
- A rendered-contrast kitchen-sink story (`src/stories/ContrastKitchenSink.stories.tsx`)
  that re-enables the axe `color-contrast` rule across the four program themes
  (the parent-brand palette is covered by the token test), proving components
  apply tokens correctly (not just that the palette is sound), per ADR 0005.

### Changed

- Upgraded Storybook 8 to 10 (10.5.2), transiting a validated Storybook 9
  checkpoint first; the config is now ESM-only, per ADR 0004.
- Rebuilt the test stack on `@storybook/addon-vitest`. Vitest now runs two
  projects: a jsdom `unit` project (contrast, token parity, component logic)
  and a real-Chromium `storybook` project that runs every story as a test
  with an axe accessibility pass; a11y violations fail CI, per ADR 0005.
- CI now installs Playwright Chromium before running tests, since the browser
  Vitest project needs the binary present.

### Removed

- `@storybook/test-runner` and the self-hosted visual-regression pipeline
  (`jest-image-snapshot` plus committed PNG baselines). Visual regression is
  parked for now (see `.storybook/VISUAL_REGRESSION.md`); the baseline images
  were purged from git history.
- `jest-axe`. The jsdom axe assertions are retired; the browser Vitest project
  is the single accessibility source. Also removed the now-dead Git LFS rule
  and objects for the retired visual-regression baselines.

## [0.1.0] - 2026-07-17

Initial public release.

### Added

- React + Tailwind component library for the Scouting America parent brand and
  four program sub-brands (Cub Scouts, Scouts BSA, Venturing, Sea Scouts).
- CSS-variable-driven theming selected by the `data-program` attribute, with a
  `ScoutThemeProvider` and `useScoutTheme()` hook.
- Components: Button, Card, CardEyebrow, Calendar, CalendarEvent, EventDialog,
  ProgramHero, ProgramMark, RegistrationCTA, DecorativeDivider, and more.
- Design tokens sourced from the 2024 Brand Guidelines, WCAG AA contrast tokens,
  and a Tailwind preset.
- Storybook 8 component lab with autodocs and self-hosted fonts.
- Self-hosted Playwright visual regression (replacing Chromatic).
- Placeholder brand marks (original work); real BSA assets are gitignored by
  design per `NOTICE.md`.

[Unreleased]: https://keepachangelog.com/
[0.1.0]: https://keepachangelog.com/
