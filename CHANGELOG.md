# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Changed

- Visual-regression baselines are now stored in Git LFS to keep `.git` small.

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
