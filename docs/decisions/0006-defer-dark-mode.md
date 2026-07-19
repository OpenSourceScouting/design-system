# 0006. Defer first-party dark mode; ship a custom-theme hook instead

Date: 2026-07-19
Status: Accepted

## Context

Dark mode was on the backlog (TODO 3.1) as a per-program feature: paired dark
palettes for all five brands plus a `theme: light | dark` toolbar. Two facts
argue against building it now:

- **Scouting America has no dark palette.** The 2024 Brand Guidelines define one
  set of brand colors. This package's guiding rule is to align to the official
  design system and minimize invented deviations (ADR 0002). Shipping opinionated
  dark values for each program would be first-party invention with no brand
  source to verify against, and it would risk reading as "official" when it is
  not.
- **It multiplies the maintenance surface.** Dark mode adds a second axis to the
  theming model (`[data-program]` × mode). The contrast guarantees (ADR 0005)
  would have to be re-derived and tested for every program in the dark palette,
  and the token-parity surface roughly doubles. That cost is only justified by
  real demand, which we do not yet have.

At the same time, individual units and projects plausibly _will_ want dark mode
(or other custom themes) for their own deployments. The theming architecture is
CSS-variable overrides selected by attribute, so a custom theme is a natural fit
that should not require forking the package. The one genuine gap was portals:
Radix widgets render at `document.body` outside the themed subtree (ADR 0002
delta 9), and the re-stamp helper only carried `data-program`, so a consumer's
own theme attribute would be lost inside dialogs, menus, and tooltips.

## Decision

Do not ship first-party dark mode. Instead, provide the extension hook so a
consumer can implement a custom theme (dark or otherwise) without forking:

- `ScoutThemeProvider` accepts an optional `theme` prop, stamped as `data-theme`
  alongside `data-program` (on the wrapper, and on `<html>` under
  `applyToDocument`), and exposed via `useScoutTheme().theme`.
- `useProgramStamp` re-stamps `data-theme` onto portalled content, so a custom
  theme applies inside overlays too, not just the main subtree.
- The library ships no theme token values. Consumers supply their own overrides
  scoped to `[data-theme]` (optionally combined with `[data-program]`) in their
  own CSS.

Revisit first-party dark mode only if there is real, recurring demand across
consumers. The token-parity test already carries a note describing how to add a
mode dimension if that happens.

## Consequences

- No turnkey dark mode in the box; a consumer that wants one authors its own
  token values and owns their contrast (ADR 0005 covers only the shipped light
  palettes). This is the accepted downside, mitigated by the hook and the README
  "Custom themes" documentation.
- The `theme` hook is general: it supports any custom theme axis a deployment
  invents (seasonal, high-vibrancy, council-specific), not only dark mode.
- If first-party dark mode is revived later, it lands additively: add
  `[data-program]`-scoped dark token blocks, extend the parity/contrast tests to
  the mode dimension, and add a Storybook toolbar global. Nothing here has to be
  unwound.
- This supersedes the TODO 3.1 acceptance criteria (which assumed we would ship
  the palettes); that task is marked deferred and points here.
