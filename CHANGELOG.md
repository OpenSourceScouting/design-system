# Changelog

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
