# 0003. Migrate to Tailwind CSS v4

Date: 2026-07-17
Status: Accepted

## Context

ADR 0002 adopts shadcn/ui patterns. shadcn's current generation targets
Tailwind v4 (CSS-first `@theme` configuration, OKLCH-friendly variable tokens,
`@tailwindcss/vite` plugin, no `tailwind.config.ts`). Staying on v3 would mean
back-porting every recipe we adopt and drifting from the idiom we just chose:
the opposite of "minimize the deltas."

The gating requirement was Storybook compatibility. Verified: Storybook 8.4's
react-vite framework loads Tailwind v4 via the `@tailwindcss/vite` plugin
(v4.1+ integrates cleanly; configuration moves from `tailwind.config.ts` into
CSS).

We are pre-release, so the migration cost is one-time and internal.

## Decision

Migrate the build to Tailwind v4 as part of the shadcn re-platform: the
`@tailwindcss/vite` plugin replaces the PostCSS setup, `@theme` / CSS variables
replace `tailwind.config.ts` + `tailwind-preset.cjs`, and the published
theming contract becomes "import our stylesheet/tokens" plus documented token
names rather than a JS preset object.

## Consequences

- Aligned with shadcn's current output and the direction of the Tailwind
  ecosystem; recipes apply without back-porting.
- The published `./tailwind-preset` export is replaced by a CSS-first contract.
  This is a breaking change to the (unpublished) package API: acceptable
  pre-release, and the README consumer docs must be rewritten with it.
- `postcss.config.js`, `tailwind.config.ts`, and `tailwind-preset.cjs` are
  retired; `scripts/build-css.mjs` is reworked for the v4 pipeline.
- Consumers on Tailwind v3 cannot use the preset path; they can still consume
  the compiled stylesheet. Documented in the migration plan.
