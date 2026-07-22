# 0004. Upgrade to Storybook 10 and adopt the Vitest addon

Date: 2026-07-18
Status: Accepted

## Context

The library was on Storybook 8.6. Storybook 10 (10.5.x) is the current major and
carries the maintained testing path, `@storybook/addon-vitest`, which supersedes
the `@storybook/test-runner` axe pass we ran as an interim stopgap (ADR 0005,
then numbered 0004; TODO 3.12).

Our stack already satisfied every Storybook 10 requirement, so nothing forced a
stop at 9: Node 22 LTS (past the 22.19 floor), Vite 5.4, Vitest 3.2, React 18
(19 is not required), TypeScript 5.6 with `moduleResolution: "bundler"`, and
`.storybook` configs that were already ESM-clean (no `require`/`__dirname`).
Storybook 10's headline breaking change is ESM-only distribution, which we had
effectively pre-paid.

Storybook forbids a direct 8 to 10 upgrade: the path must transit 9. So the
entire 9 migration cost was unavoidable, and resting at 9 would only mean
repeating the ceremony within months.

Two constraints shaped the plan: do not build test infrastructure on 9 that would
be rebuilt on 10 (build it once, on the final stack), and treat visual regression
as non-critical for a pre-1.0 library.

## Decision

Upgrade to Storybook 10 via a validated Storybook 9 checkpoint (`8 -> 9 -> 10`),
committing a fully green 9 as a known-good fallback before the ESM-only 9 to 10
bump.

Adopt `@storybook/addon-vitest` as the test stack on Storybook 10: stories run as
tests in real Chromium with axe. Vitest is split into two projects: a jsdom
"unit" project (contrast, token parity, component unit/behavior) and a browser
"storybook" project (stories + axe). a11y violations fail CI
(`parameters.a11y.test = "error"`); `color-contrast` is disabled there because
`tests/contrast.test.ts` owns it. The jsdom axe layer that existed during the
migration was subsequently retired in ADR 0005 (the browser project is the single
a11y source).

Retire `@storybook/test-runner` entirely, including its visual-snapshot job. Do
not rebuild visual regression now: it is parked (manual review for a pre-1.0
library), and the stale baseline PNGs are removed from the tree and purged from
git history. This supersedes TODO R.1.

## Consequences

- Current with the ecosystem and the shadcn tooling direction; one browser-based
  suite where the stories are the tests, replacing both the jsdom-only axe and
  the interim test-runner axe pass.
- CI must install Playwright Chromium before the test step (the browser project
  needs it).
- Accessibility coverage never went dark during the migration: the jsdom suite
  (contrast, parity, unit tests) is Storybook-version-independent and stayed green
  throughout, and the 9 checkpoint remained a shippable fallback.
- Visual regression is gone until deliberately rebuilt (a follow-up in
  `docs/TODO.md`). Acceptable pre-1.0; the trade is less pixel coverage for a far
  smaller, maintained toolchain and ~5 MB reclaimed from history.
- ADR 0005 (accessibility testing strategy) was re-derived for the Vitest addon
  and re-accepted on the new stack (item 2 moved from the retired test-runner
  axe pass to `@storybook/addon-vitest`).
- The auto-suggested `@storybook/addon-mcp` was declined to keep the install lean.
