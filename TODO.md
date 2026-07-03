# Scouting America Design System: backlog

Self-contained task list for follow-up work identified in the 2026-06-04 review.
Each task is independently executable. Pick by priority tier; within a tier the
order is rough. Every task lists: motivation, files, acceptance criteria, and
effort estimate.

Conventions for anyone picking up work here:
- Read `CLAUDE.md` first. It contains hard rules (theming model, asset legal
  rules, contrast tokens) that are easy to get wrong from a quick skim of the code.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Never use em-dashes in code, comments, commits, or docs (user preference).
- Never commit anything under `public/marks/` other than `README.md`.
- After changes, run `npm run typecheck` and `npm run build`. Both must pass.
- Mark tasks complete by changing `[ ]` to `[x]` and adding a one-line
  outcome note under the task.

---

## Tier 1: correctness and accessibility bugs (do first)

### [x] 1.1 Fix SSR / strict-mode side effect in ScoutThemeProvider

> Done 2026-07-02: applyToDocument now runs in useEffect with a cleanup that
> restores the previous data-program value on unmount or program change.

**Why:** `src/lib/theme/ScoutThemeProvider.tsx:130-132` calls
`document.documentElement.setAttribute(...)` during render. React 18 strict
mode invokes render twice; SSR has no `document`. Side effects belong in
`useEffect`.

**Files:** `src/lib/theme/ScoutThemeProvider.tsx`

**Acceptance:**
- The `applyToDocument` branch runs in `useEffect`, not during render.
- Cleanup function removes the attribute (or restores prior value) when the
  provider unmounts or `program` changes.
- No `typeof document !== "undefined"` guard needed in `useEffect` (effects
  do not run on the server).
- Typecheck passes; existing demo in `src/App.tsx` still themes correctly.

**Effort:** 15 min.

---

### [x] 1.2 Respect prefers-reduced-motion on Button press

> Done 2026-07-02: press translation is now motion-safe:active:translate-y-[1px].

**Why:** `src/components/Button.tsx:19` has `active:translate-y-[1px]`. The
reduced-motion CSS in `tokens.css:196-205` only zeroes `transition-duration`
and `animation-duration`, not transforms. Users with `prefers-reduced-motion:
reduce` still see the 1px jump.

**Files:** `src/components/Button.tsx`

**Acceptance:**
- Press translation wrapped in `motion-safe:` (Tailwind variant). Existing
  hover/transition utilities remain.
- Visually identical for users without reduced-motion preference.
- Storybook a11y addon shows no new violations.

**Effort:** 5 min.

---

### [x] 1.3 Add forced-colors (Windows High Contrast) support

> Done 2026-07-02: forced-colors block at the end of tokens.css disables the
> shadow token, borders every button in ButtonText, and forces focus-visible
> to the system Highlight. Still pending: eyeball it on real Windows HC or
> Chrome DevTools rendering emulation (not scriptable from this environment).

**Why:** CSS variables get silently overridden by system colors in
`forced-colors: active`. Themed buttons can lose their fill and become
invisible on Windows HC mode. Required for enterprise and school deployments.

**Files:** `src/styles/tokens.css` (add a new media block at end);
spot-check `Button`, `Badge`, `Alert`, `Card`.

**Acceptance:**
- New `@media (forced-colors: active)` block in `tokens.css` overrides key
  surfaces with system color keywords: `ButtonText`, `ButtonFace`,
  `Highlight`, `HighlightText`, `Canvas`, `CanvasText`, `LinkText`.
- Focus ring uses `Highlight` in forced-colors mode.
- Manual verification on Windows or via Chrome DevTools "Emulate CSS media
  feature forced-colors".

**Effort:** 1-2 hours including verification.

---

### [x] 1.4 Cub Scouts gold accent button: small size fails AA

> Done 2026-07-02: approach A. ButtonProps is a discriminated union that
> excludes size="sm" when variant="accent", plus a dev-mode console.warn for
> untyped call sites. Button stories updated to satisfy the constraint.

**Why:** `tokens.css:59` defines `--program-on-accent: 0 63 135` (blue on
gold). Comment notes "passes AA at 16pt+". `Button size="sm"` is `text-xs`
(12px), which fails 4.5:1. Same risk applies to Venturing and Sea Scouts
yellow accents.

**Files:** `src/components/Button.tsx`, possibly `tokens.css`.

**Acceptance:** pick one approach:
- **A:** Block `size="sm" variant="accent"` at the type level
  (`type ButtonProps` discriminated union) with a runtime dev warning.
- **B:** When `variant="accent"` and `size="sm"`, override text color to
  pure white via a CSS class.
- **C:** Document the constraint in `Button.stories.tsx` and tokens.

Pick A if feasible, otherwise B. Document the decision in this file under the
task.

**Effort:** 1 hour.

---

### [x] 1.5 Calendar month view breaks on mobile

> Done 2026-07-02: below 640px a matchMedia hook renders agenda and hides the
> Month toggle; the chosen view returns on resize. New story
> MobileFallsBackToAgenda uses the mobile1 viewport. Verified at 375px.

**Why:** `src/components/Calendar.tsx:344` renders 7 columns of
`min-h-[88px]` cells. At 360px viewport each cell is roughly 50px wide; event
chips clip and day numbers crowd. The agenda view (line 468) is already
mobile-friendly.

**Files:** `src/components/Calendar.tsx`

**Acceptance:**
- Below the `sm` breakpoint (640px), the month view auto-switches to agenda
  view, OR the view toggle hides "Month" and forces "Agenda".
- The user-controllable `view` prop still works above `sm`.
- Add a Storybook viewport (`storybook/addon-essentials` viewports addon, no
  install needed) story showing the mobile behavior.

**Effort:** 1-2 hours.

---

## Tier 2: distributability (the "share this with others" gap)

### [x] 2.1 Convert from showcase repo to publishable library

> Done 2026-07-02: package published as @scouting-america/design-system@0.1.0
> with exports map, peerDependencies, vite-plugin-dts, ES+CJS outputs, CSS
> artifacts, tailwind-preset.cjs, and publicDir:false on lib build to prevent
> gitignored brand marks from leaking into the tarball. npm pack produces a
> clean 30-file tarball; consumer typecheck passes.

**Why:** `package.json` is `"private": true` with no library build target,
no `exports`, no `peerDependencies`. A council webmaster cannot
`npm install` this today, even though the README invites reuse.

**Files:** `package.json`, `vite.config.ts`, new `tsconfig.lib.json`.

**Acceptance:**
- `package.json`:
  - Remove `"private": true`.
  - Add `peerDependencies: { react: ">=18", react-dom: ">=18" }`.
  - Move `react` and `react-dom` out of `dependencies`.
  - Add `exports` map with `.` (component entry), `./styles`
    (`dist/style.css`), `./tokens` (raw token CSS).
  - Add `files: ["dist"]`.
  - Add `main`, `module`, `types`, `sideEffects: ["**/*.css"]`.
- `vite.config.ts`: add `build.lib` config (entry `src/index.ts`, formats
  `es` + `cjs`, externalize peers).
- Add `vite-plugin-dts` for `.d.ts` emit.
- `npm pack` produces a tarball; `npm i ./scouting-america-design-system-0.1.0.tgz`
  in a fresh Vite project works end to end. Document this verification in
  the task note.
- Storybook still runs (`npm run storybook`).

**Effort:** 3-4 hours.

---

### [ ] 2.8 Open the Program union so third parties can register a fifth program

**Why:** `Program` is a closed string-literal union (`"cub" | "scoutsbsa" | "venturing" | "seascouts"`). A council running a custom youth program (or a future fifth national program) cannot add a brand without forking the package. Additionally, the `forced-colors` block in `tokens.css` hard-codes all four program names with `[data-program="..."]` selectors, meaning any fifth program gets no high-contrast support automatically.

**Files:** `src/lib/theme/ScoutThemeProvider.tsx`, `src/styles/tokens.css`, `tailwind-preset.cjs`, `src/index.ts`.

**Acceptance:**
- `Program` becomes `"cub" | "scoutsbsa" | "venturing" | "seascouts" | (string & {})` (or a documented extension pattern) so extra programs are assignable without a type error.
- `ScoutThemeProvider` accepts any string value for `program` and sets `data-program` accordingly; components that switch on program fall back gracefully to a sensible default (suggest Scouts BSA tokens) rather than rendering nothing.
- The `forced-colors` block either uses a universal `[data-program]` selector or documents that consumers must add their own forced-colors overrides.
- Typecheck passes; existing four-program stories are visually unchanged.

**Effort:** 2-3 hours.

---

### [ ] 2.9 Open variant records on Button, Card, Badge, and Alert

**Why:** `Button`'s `variant` prop is a closed enum (`"primary" | "secondary" | "accent" | "ghost"`). The same pattern applies to `Card`, `Badge`, and `Alert`. Consumers cannot add a variant (e.g. a council "danger" badge or an "outline-accent" button) without forking the component. A discriminated-union approach that hard-codes every string also makes the TS type errors cryptic for newcomers.

**Files:** `src/components/Button.tsx`, `src/components/Card.tsx`, `src/components/Badge.tsx`, `src/components/Alert.tsx`.

**Acceptance:**
- Each component exposes a `classNames` or `className` escape hatch that lets consumers supply fully custom Tailwind classes alongside (not instead of) variant defaults.
- Alternatively, each component exports its `variantStyles` map so consumers can spread it and add entries via `cva` or a wrapper component without touching library source.
- No existing variant behavior changes.
- Typecheck passes; Storybook stories unchanged.

**Effort:** 2-3 hours.

---

### [ ] 2.2 Self-hosted fonts as an optional package step

**Why:** Default is jsDelivr (already done 2026-06-04). For consumers who
want zero third-party requests, the workflow is documented in `README.md`
under "Fonts" but not enforced or scriptable.

**Files:** `README.md` (already covers it), optionally a new
`examples/self-host-fonts/` directory.

**Acceptance:**
- An `examples/self-host-fonts/main.tsx` shows the four imports.
- README link added under "Fonts" section pointing to the example.

**Effort:** 30 min. Skip if not needed.

---

### [ ] 2.3 Generate framework-neutral token artifacts

**Why:** Real audience is mixed: WordPress, Wix, Mailchimp, Figma, Canva,
print designers. Tailwind utility classes do not reach them. A framework
neutral token export does.

**Files:** new `tokens/` source directory, build script in `package.json`.

**Acceptance:**
- Adopt Style Dictionary (`npm i -D style-dictionary`).
- Source of truth moves to `tokens/source/*.json` (one file per program plus
  a base file). `src/styles/tokens.css` becomes a generated artifact.
- Build outputs:
  - `dist/tokens/tokens.css` (current `src/styles/tokens.css` shape).
  - `dist/tokens/tokens.json` (flat key/value for designer tools).
  - `dist/tokens/tokens.scss` (for SCSS consumers).
  - `dist/tokens/tokens.email.json` (hex-only, no CSS vars, for email tools).
- `npm run build:tokens` script wired up; runs before `npm run build`.
- Document the workflow in `README.md`.

**Effort:** 1 day.

---

### [ ] 2.4 Set up Vitest + jest-axe + contrast assertion tests

**Why:** Repo claims WCAG AA but has no automated verification. A single
token regression could break contrast silently.

**Files:** `vitest.config.ts`, new `src/**/*.test.ts(x)` files,
new `tests/contrast.test.ts`, `package.json` script.

**Acceptance:**
- `npm run test` runs Vitest in JSDOM mode.
- Each component has a smoke test + `axe(container)` assertion (use
  `jest-axe`).
- `tests/contrast.test.ts` parses `tokens.css`, computes contrast ratios for
  every `--program-on-*` / `--program-*` pair, and asserts the documented
  thresholds (4.5:1 for `-soft` and `-on-surface`, 3:1 for `-faint`).
- CI workflow runs the test suite on every PR (see task 2.7).

**Effort:** 1 day.

---

### [ ] 2.5 Publish Storybook to a public URL

**Why:** `build-storybook` exists but no deploy. Marketers and designers
should be able to browse components without cloning the repo.

**Files:** new `.github/workflows/storybook.yml`.

**Acceptance:**
- GitHub Actions workflow on push to main: build Storybook, deploy to
  GitHub Pages (or Chromatic if the user wants visual regression too).
- Public URL added to `README.md` Quick Start section.

**Effort:** 1 hour.

---

### [ ] 2.6 Add CHANGELOG and Changesets

**Why:** A library that ships to councils needs versioned releases and
human-readable change notes. Brand books are versioned (2024 edition); the
code should mirror that.

**Files:** `.changeset/config.json`, `CHANGELOG.md`, `.github/workflows/release.yml`.

**Acceptance:**
- `npm i -D @changesets/cli && npx changeset init` done.
- A `release` workflow opens a "Version Packages" PR when changesets exist
  and publishes to npm (or GitHub Packages) when merged.
- CONTRIBUTING.md added with a one-paragraph changeset workflow.

**Effort:** 2 hours.

---

### [ ] 2.7 CI: typecheck + test + build on every PR

**Why:** Prevents regressions on the items above.

**Files:** new `.github/workflows/ci.yml`.

**Acceptance:**
- Workflow runs on `pull_request`: `npm ci`, `npm run typecheck`,
  `npm run test`, `npm run build`, `npm run build-storybook`.
- Status check required before merge.

**Effort:** 30 min.

---

## Tier 3: design-system polish (real value-add, not corrections)

### [ ] 3.1 Dark mode per program

**Why:** Scouting happens outdoors at night. Dark mode is not a luxury for
this audience.

**Files:** `src/styles/tokens.css`, optionally `ScoutThemeProvider`.

**Acceptance:**
- Each program block has a paired `@media (prefers-color-scheme: dark)` set
  of overrides, OR a `[data-theme="dark"][data-program="cub"]` selector axis.
- `globals.css` removes the hard-coded `color-scheme: light` and instead
  declares both.
- Storybook toolbar gains a `theme: light | dark` global (alongside the
  existing `program` global).
- Contrast tests (2.4) cover the dark palette too.

**Effort:** 1 day (the hard part is picking dark-palette values that stay
faithful to each program's print brand).

---

### [ ] 3.2 Motion language tokens per program

**Why:** Personality is currently encoded as static traits (radius, weight,
shadow). Motion is the missing felt difference: Cubs should bounce, Sea
Scouts should glide, Venturing should snap. Adds brand depth at near-zero
runtime cost.

**Files:** `src/styles/tokens.css`, `tailwind.config.ts`, callers
(`Button`, `Card`, `EventDialog`).

**Acceptance:**
- New tokens per program block:
  - `--program-motion-easing`
  - `--program-motion-duration-fast`
  - `--program-motion-duration-base`
- Tailwind extension: `transitionTimingFunction.program`,
  `transitionDuration.program` and `program-slow`.
- At least Button and Card use the program-themed motion variables in their
  transitions.
- Reduced-motion still zeroes everything (already handled in tokens.css).

**Effort:** 3-4 hours.

---

### [ ] 3.3 Voice / microcopy library

**Why:** Marketers' #1 complaint about engineering-led design systems: they
get colors and components but no words. Cub Scouts copy is not Venturing
copy.

**Files:** new `src/lib/voice/microcopy.ts` plus per-program JSON.

**Acceptance:**
- One JSON file per program in `src/lib/voice/{program}.json` covering at
  least: CTA verbs (3-5), empty-state strings (3), error strings (3),
  success strings (3), reading-level target (Flesch-Kincaid grade).
- Helper: `useMicrocopy(): Microcopy` reads from `useScoutTheme()` context
  and returns the active program's strings.
- One component (suggest `RegistrationCTA`) wired to use it as a default.
- Voice rules documented in `README.md` (do/don't word lists per program).

**Effort:** 1-2 days (the writing is the work).

---

### [ ] 3.4 CMYK and Pantone equivalents in tokens

**Why:** Brand book has them on p.14 of the 2024 PDF. Designers building
yard signs, banners, council magazines need the matching CMYK/Pantone, and
keeping them inside the token system prevents drift.

**Files:** `tokens/source/*.json` (after task 2.3) or extend
`src/styles/tokens.css` with comments.

**Acceptance:**
- Each named color has `srgb`, `cmyk`, `pantone` fields in the JSON source.
- Style Dictionary build emits a print-ready JSON artifact alongside CSS.
- README "Programs at a glance" table shows Pantone values.

**Effort:** half-day (mostly transcription from the PDF).

---

### [ ] 3.5 Container queries on layout components

**Why:** Tailwind viewport breakpoints break when a `<FeatureGrid columns={4}>`
is placed in a 400px sidebar on a 1440px screen. Container queries fix this.

**Files:** `src/components/FeatureGrid.tsx`, `src/components/Calendar.tsx`,
`tailwind.config.ts` (enable `@tailwindcss/container-queries`).

**Acceptance:**
- FeatureGrid switches column count based on container width, not viewport.
- Calendar may use container queries for the month view threshold (relates
  to task 1.5).
- Stories include narrow-container demos.

**Effort:** 3-4 hours.

---

### [ ] 3.6 Open FeatureGrid's per-feature card structure via render slots

**Why:** `FeatureGrid` renders each feature as a fixed-structure card (icon, heading, body text). Consumers cannot change the card layout, add a CTA link, swap the icon for an image, or inject additional metadata without forking the component. This limits real-world adoption where feature cards routinely need custom content (event counts, links, photos).

**Files:** `src/components/FeatureGrid.tsx`, `src/components/FeatureGrid.stories.tsx`.

**Acceptance:**
- `FeatureGrid` accepts a `renderFeature?: (feature: Feature, index: number) => ReactNode` prop. When supplied, it replaces the default card rendering entirely.
- The existing default rendering is pixel-identical when `renderFeature` is not provided.
- Export the `Feature` type from `src/index.ts` so consumers can type their render prop without reaching into internal paths.
- Add a Storybook story showing a custom render prop (e.g. a feature card with a background image and a "Learn more" link).
- Typecheck passes.

**Effort:** 1-2 hours.

---

### [ ] 3.7 Iconography pack

**Why:** Lucide is generic. Programs have specific motifs: fleur-de-lis
(SA), compass (Scouts BSA), mountain (Venturing), anchor (Sea Scouts).

**Files:** new `src/components/icons/*.tsx` or `src/lib/icons/`.

**Acceptance:**
- One React component per program-specific glyph, sized via prop, themed
  via `currentColor` and `--program-*`.
- Storybook page showing the set across all four programs.
- Exported from `src/index.ts`.

**Effort:** 1 day (drawing the icons is the work).

---

### [ ] 3.8 Email-safe HTML template + Mailchimp-friendly CSS bundle

**Why:** Email clients do not support CSS variables. Marketers cannot use
this system in Mailchimp/Constant Contact without inline hex.

**Files:** new `dist/email/styles.css` (from Style Dictionary build),
new `examples/email-template/index.html`.

**Acceptance:**
- A flat CSS file with hex literals (no `var()`) emitted by the token build.
- An example HTML email using inline styles per program.
- README section on email use.

**Effort:** half-day.

---

### [ ] 3.9 RTL support audit

**Why:** Scouting is global. US councils also serve Arabic/Hebrew speakers.

**Files:** all components, but especially `Calendar`, `EventCard`,
`EventDialog`, `RegistrationCTA`.

**Acceptance:**
- Every `pl-*`/`pr-*`/`ml-*`/`mr-*` replaced with `ps-*`/`pe-*`/`ms-*`/`me-*`
  (Tailwind logical properties).
- Storybook gains a `direction: ltr | rtl` global.
- Calendar week starts and weekday labels respect locale.

**Effort:** 1 day.

---

## Tier 4: nice-to-have

### [ ] 4.1 Chromatic visual regression
Free OSS tier. Catches per-program rendering regressions across the
component × program matrix that no human reviewer will catch reliably.
**Effort:** 2 hours.

### [ ] 4.2 `examples/` directory with reference integrations
Subdirectories: `nextjs-app/`, `vanilla-html/`, `wordpress-block-theme/`,
`mailchimp-email/`. Each is a minimal working consumer of the package.
**Effort:** 1-2 days.

### [ ] 4.3 Figma library generated from token JSON
Use Tokens Studio plugin to consume `dist/tokens/tokens.json`. Closes the
designer ↔ engineer loop.
**Effort:** 1 day (mostly Figma work).

### [ ] 4.4 `prefers-contrast: more` overrides
Boost contrast tokens when users opt in. WCAG 2.2 SC 1.4.6 (AAA), increasingly
expected on government/nonprofit sites.
**Effort:** 2 hours.

### [ ] 4.5 Imagery component with brand contract
`<ProgramImage program="cub" treatment="warm-overlay" aspect="16:9" />`.
Encodes brand book photography rules.
**Effort:** half-day.

---

## Notes for whoever picks this up next

- The 2024 brand guidelines PDF is at
  `research/scouting-america-brand-guidelines-2024.pdf`. Cite page numbers
  in token comments and PR descriptions when changing colors or typography.
- `CLAUDE.md` has the deeper rules. Read it before touching theming code.
- When a task overlaps with another (1.5 ↔ 3.5, 2.3 ↔ 3.4 ↔ 3.8),
  prefer doing the token-source task first so the polish tasks consume the
  new artifact instead of editing two places.
