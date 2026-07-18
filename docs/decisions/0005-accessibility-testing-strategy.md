# 0005. Accessibility testing strategy

Date: 2026-07-18
Status: Accepted

Supersedes the Storybook 8 arrangement (the same decision, re-derived after the
Storybook 10 migration in ADR 0004).

## Context

WCAG AA is a product goal for this library (ADR 0002), so it needs automated
verification, not just intent. No single tool covers it, and the tools overlap,
so the strategy must divide the work deliberately. The organizing principle is
**divide by what varies per program**, because the theming architecture
guarantees that per-program difference is CSS-variable-only:

- **Contrast varies per program.** The same utility renders five palettes
  (parent brand plus four programs), and components composite opacity tints
  (`/80`, `/85`) over program surfaces. This is a combinatorial, pixel-level
  concern.
- **Semantics do not vary per program.** Roles, names, labels, ARIA, and DOM
  structure are identical across programs; only colors change. So semantic a11y
  needs to be checked thoroughly once, not once per program.

Tool limits that shape the split:

- jsdom (Vitest) cannot lay out or paint, so axe-core silently disables
  `color-contrast` there and cannot judge focus or the computed accessibility
  tree. It sees roles/names/ARIA structure and little else: strictly a subset of
  what a real browser sees.
- `@storybook/addon-vitest` runs every story as a test in real Chromium: it runs
  axe per story AND executes `play` functions as interaction tests. This is the
  authoritative a11y layer (ADR 0004). It runs in `npm test` and in CI.
- `@storybook/addon-a11y` also powers the interactive a11y panel in the Storybook
  UI.
- A token-parsing unit test can assert exact WCAG ratios for every token pair
  across all five palettes: more exhaustive and deterministic than any per-story
  sample.

## Decision

A layered strategy, each layer owning what it checks best:

1. **Token contrast (palette soundness): `tests/contrast.test.ts`** (Vitest
   `unit` project, no browser). Parses `tokens.css` and asserts WCAG ratios for
   every semantic pair across all five palettes, including the `/80` and `/85`
   text composites flattened over each surface. Proves the palette itself is AA.

1b. **Rendered contrast (correct application): the contrast kitchen-sink story**
(`src/stories/ContrastKitchenSink.stories.tsx`, scanned by the browser
project). The token test proves the palette is sound; it does not prove a
component applies the right token. This story renders a curated set of
components and text-on-surface pairs under each program theme with the axe
`color-contrast` rule turned back ON (it is disabled globally, see below), so
a component that puts low-contrast text on a surface fails. It is curated to
pairs that must meet 4.5:1 at their rendered size, and deliberately omits
by-design exceptions (`text-os-on-surface-faint` at 3:1, `accent size="sm"`)
so failures are real.

2. **Semantics and interaction: the `@storybook/addon-vitest` browser project.**
   Every story runs in Chromium with an axe pass (roles, names, labels, ARIA,
   focusable structure: what jsdom cannot see). `parameters.a11y.test = "error"`
   in `.storybook/preview.tsx` makes violations fail CI; `color-contrast` is
   disabled there on purpose (layers 1 and 1b own contrast). Scans run at the
   default program (cub); that is sufficient because semantics are
   program-invariant. For interactive widgets, use `play` functions to assert
   focus order, focus trap, and escape-to-close: the real-browser capability the
   old screenshot-only pass never had.

3. **Fast unit logic: the jsdom `unit` Vitest project.** Component smoke and
   behavior tests (e.g. `ProgramMark` fallback, `Button` dev warning, `Calendar`
   date math), plus the contrast and token-parity tests. This is the sub-3s inner
   loop (`npx vitest --project unit`). It does NOT run axe: a second, lower-
   fidelity a11y layer bought nothing (browser watch mode already gives a warm
   loop, and a green jsdom axe never justified skipping the browser run). The
   jsdom stubs in `tests/setup.ts` (ResizeObserver, pointer-capture,
   scrollIntoView) remain, because the non-a11y widget tests still need them.

4. **Authoring aid: `@storybook/addon-a11y` panel.** Manual, in the Storybook UI,
   for catching issues while building a component.

## Consequences

- One authoritative a11y source (the browser project), not two. Every new
  component needs a **story** (that is the required a11y coverage); a jsdom test
  is for non-a11y unit logic and is optional for a11y purposes.
- Focus/keyboard behavior is now testable via `play` functions, closing a gap the
  Storybook 8 strategy left open (jsdom could not judge focus; the test-runner
  only screenshotted).
- Rendered-contrast misuse is caught by the kitchen-sink story; the previously
  hidden gap (token test proves palette, not application) is closed for the
  curated set. Contrast outside that set is still covered at the token level and
  by manual review.
- CI must `npx playwright install chromium` before `npm test` (the browser
  project needs it). A story opts out of the a11y pass with
  `parameters: { a11y: { test: "off" } }` (not the old `{ disable: true }`, which
  only hid the panel).
- Do not re-enable `color-contrast` globally in the browser a11y config. It is
  deferred to the token test and the kitchen-sink story on purpose; enabling it
  on every story produces noisy, less precise failures (disabled controls,
  decorative elements, by-design 3:1 tokens).
- The strategy earns its keep: the browser axe pass caught, during the Storybook
  10 migration itself, that the `NativeSelect` story rendered a `<select>` with
  no accessible name (`select-name`), which was then fixed. (It earlier caught
  that Radix `PopoverContent` is `role="dialog"` and needs an accessible name.)
- Every new portalled widget still needs its content re-stamped (ADR 0002 delta 9) so both the browser scan and the jsdom widget tests see the themed tree.
