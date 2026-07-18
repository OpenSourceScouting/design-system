# 0004. Accessibility testing strategy

Date: 2026-07-18
Status: Accepted

## Context

WCAG AA is a product goal for this library (ADR 0002), so it needs automated
verification, not just intent. Several tools overlap and each has real limits:

- jsdom (Vitest) cannot lay out or paint, so axe-core silently disables its
  `color-contrast` rule there and cannot judge visible focus. jsdom axe catches
  roles, names, labels, and ARIA structure, and little else.
- `@storybook/addon-a11y` (installed) only powers the interactive a11y panel in
  the Storybook UI. It does not run in CI on its own.
- The `@storybook/test-runner` already visits every story in a real Chromium (in
  the pinned Playwright container) for visual regression, but was only taking
  screenshots.
- Contrast in this system is a multi-program problem: the same utility renders
  five palettes, and components composite opacity tints (`/80`, `/85`) over
  program surfaces. That is more combinations than a per-story axe sample covers.

## Decision

Use a layered strategy with a deliberate division of labor, so each concern is
checked by the tool that checks it best and nothing is checked twice.

1. **Color contrast: `tests/contrast.test.ts` (Vitest, no browser).** Parses
   `tokens.css` and asserts WCAG ratios for every semantic pair across all five
   palettes, including the `/80` and `/85` text composites flattened over each
   surface. This is exhaustive and deterministic in a way a per-story axe sample
   is not.

2. **Semantics and focus: real-browser axe in the test-runner `postVisit`**
   (`axe-playwright`). Runs on every story in Chromium, after the screenshots so
   a baseline-update pass is never blocked. `color-contrast` is **disabled here
   on purpose** because item 1 owns it; this pass focuses on roles, names,
   labels, ARIA, and focusable-content structure, which jsdom cannot see. A story
   opts out with `parameters: { a11y: { disable: true } }`.

3. **Fast inner loop: jsdom jest-axe smoke tests per component.** One `axe()`
   assertion per component in the Vitest suite, so `npm test` gives sub-second
   ARIA/label/role regression signal without a browser. The `region` rule is
   disabled for isolated widget scans (a landmark is a page concern; a component
   test renders no `<main>`/`<nav>`).

4. **Authoring aid: `@storybook/addon-a11y` panel.** Manual, in the Storybook UI,
   for catching issues while building a component.

Contrast lives in a unit test rather than axe because it is more precise and
exhaustive there; the browser axe pass exists for exactly what the token math
and jsdom cannot see.

This is the Storybook 8 arrangement. It is an interim stopgap: TODO 3.12 upgrades
to Storybook 9 and adopts the Vitest addon, which runs stories as browser tests
with a11y built in and would consolidate items 2 and 3 (stories as the tests),
retiring the test-runner axe bolt-on.

## Consequences

- Accessibility is enforced in CI: the visual-regression job now also fails on
  axe violations. Every component, widget, and program is covered in a real
  browser.
- Do not "fix" the test-runner by re-enabling `color-contrast` there. It is
  deferred to `contrast.test.ts` on purpose; enabling it duplicates and produces
  noisier, less precise failures.
- Every new component needs a jsdom smoke test, and every new portalled widget
  needs its content re-stamped (ADR 0002 delta 9) so the axe scan sees the themed
  tree.
- The strategy already earns its keep: on first run the browser axe pass caught
  that Radix `PopoverContent` is `role="dialog"` and requires an accessible name
  (the consumer must label it, as with stock shadcn).
- When Storybook 9 lands (TODO 3.12), revisit this ADR: the Vitest addon
  supersedes item 2, and the visual-regression pipeline decision is made then.
