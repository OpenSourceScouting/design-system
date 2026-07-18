# Visual regression: parked

Automated visual regression is **not currently running.**

It previously used `@storybook/test-runner` + `jest-image-snapshot` against
committed PNG baselines in a pinned Playwright container. That pipeline was
retired in the Storybook 10 upgrade (ADR 0004 / ADR 0005) because:

- `@storybook/test-runner` is superseded on Storybook 10 by
  `@storybook/addon-vitest`, which does not do pixel snapshotting the same way.
- The committed baselines were never regenerated after the shadcn/Tailwind v4
  re-platform, so the job had been red regardless.
- The project is pre-1.0 (alpha); pixel regressions are being caught by manual
  review for now.

The baseline PNGs were removed from the working tree and purged from git history
to reclaim space.

## What still guards rendering

- **Accessibility (roles, names, ARIA, focus):** real-browser axe on every story
  via `@storybook/addon-vitest` (the Vitest `storybook` project). Run with
  `npm run test` or `npx vitest --project=storybook`.
- **Color contrast:** `tests/contrast.test.ts` (exhaustive, per program).
- **Manual visual check:** `npm run storybook`, then eyeball across the program
  toolbar.

## If visual regression is wanted again

Rebuild it on `@storybook/addon-vitest` using Playwright's own snapshotting
(`toHaveScreenshot`) inside the browser project, or reintroduce a dedicated
Playwright screenshot job. Generate baselines in a pinned Linux container so
font hinting/antialiasing stays deterministic across macOS and CI. Tracked as a
follow-up in `docs/TODO.md`.
