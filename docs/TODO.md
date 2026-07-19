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

## Outstanding from the shadcn re-platform (as of 2026-07-18)

The shadcn/ui + Tailwind v4 re-platform (ADR 0002/0003, executed via
`docs/shadcn-migration-plan.md`) is complete and merged to `main` (Phases 1-6):
tokens in shadcn vocabulary + `--os-*`, v4 CSS-first build (`theme.css`), all
primitives/forms/widgets on `cva` + Radix, legacy `--program-*` removed. Read
`CLAUDE.md` for the current model. Immediate follow-ups:

### [x] R.1 Regenerate visual-regression baselines (blocks a green CI visual job)

> Superseded 2026-07-18 (ADR 0004, Storybook 10 upgrade): the
> `@storybook/test-runner` visual-regression pipeline was retired and its
> baselines removed and purged from git history, so there is nothing left to
> regenerate. Visual regression is parked for now (project is pre-1.0/alpha,
> manual review in the interim); see the new Tier 4 follow-up task to rebuild
> it on `addon-vitest`/Playwright.

**Why:** Every component's rendering changed in the migration (v4 color-mix
opacity, new token values, new widgets, rebuilt EventDialog), so the committed
baselines under `.storybook/__image_snapshots__/` are stale and the visual job
will report diffs until they are refreshed.

**How:** They CANNOT be regenerated locally: the in-container Storybook build
OOMs, and building on the host then screenshotting in the container yields blank
images (both verified this session). Trigger the CI "Visual regression" workflow
via `workflow_dispatch` with `update_baselines=true` (see
`.storybook/VISUAL_REGRESSION.md`); it runs in the pinned Playwright container
and uploads the regenerated PNGs as an artifact to download and commit. Stories
added in the migration (overlays, navigation, Toaster) need first-time baselines
too.

**Effort:** ~30 min (mostly CI wait + committing the artifact).

### Operational state

- `main` has the merge commit but is NOT pushed. Push when ready.
- Branches `feat/shadcn-replatform` (merged) and `spike/phase0-shadcn-tw4`
  (throwaway Phase 0 spike) can be deleted.
- The `@storybook/test-runner` real-browser axe pass that ran after the
  screenshots was an interim stopgap; it has been replaced by
  `@storybook/addon-vitest` on Storybook 10 (task 3.12), and the test-runner
  itself has been retired. Do not re-enable `color-contrast` in the addon's
  a11y check; it is deferred to `tests/contrast.test.ts`.
- Docs at `docs/decisions/` (0002 delta register, 0003 Tailwind v4, 0004 adopt
  Storybook 10, 0005 a11y testing, Draft) capture the intentional deviations
  and testing strategy.

---

## Tier 1: correctness and accessibility bugs (do first)

### [x] 1.1 Fix SSR / strict-mode side effect in ScoutThemeProvider

> Done 2026-07-02: applyToDocument now runs in useEffect with a cleanup that
> restores the previous data-program value on unmount or program change.

**Why:** `src/lib/theme/ScoutThemeProvider.tsx` (was lines 130-132, now the useEffect is at ~135-147) called
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
- Typecheck passes; existing demo in `demo/App.tsx` still themes correctly.

**Effort:** 15 min.

---

### [x] 1.2 Respect prefers-reduced-motion on Button press

> Done 2026-07-02: press translation is now motion-safe:active:translate-y-[1px].

**Why:** `src/components/Button.tsx:19` has `active:translate-y-[1px]`. The
reduced-motion CSS in `tokens.css` (was lines 196-205, now the block starts at ~line 222) only zeroes `transition-duration`
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

**Why:** `tokens.css` (was line 59, now ~line 81) defines `--program-on-accent: 0 63 135` (blue on
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

> Done 2026-07-02: package published as @opensourcescouting/design-system@0.1.0
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

### [x] 2.8 Open the Program union so third parties can register a fifth program

> Done 2026-07-18: `Program` is now `KnownProgram | (string & {})` (KnownProgram
> is the 4-literal union from PROGRAMS). Added `DEFAULT_PROGRAM` (scoutsbsa),
> `isKnownProgram()`, and `resolveKnownProgram()`; PROGRAM_META / PROGRAM_ICONS
> retyped to `Record<KnownProgram, ...>`. The four components that index those
> maps (ProgramIcon, ProgramMark, ProgramHero, RegistrationCTA) resolve to a
> known program for metadata/icons (graceful Scouts BSA fallback) while the raw
> name still reaches `data-program` and the ProgramMark asset URL. forced-colors
> block now targets `[data-program]` universally. New helpers/types exported
> from index.ts; README gained a "Register a custom program" section; new tests
> in ScoutThemeProvider.test.tsx cover the guards + no-crash fallback. theme.css
> needed no change (it maps `var(--*)`, program-name-agnostic). Typecheck +
> build pass.

**Why:** `Program` is a closed string-literal union (`"cub" | "scoutsbsa" | "venturing" | "seascouts"`). A council running a custom youth program (or a future fifth national program) cannot add a brand without forking the package. Additionally, the `forced-colors` block in `tokens.css` hard-codes all four program names with `[data-program="..."]` selectors, meaning any fifth program gets no high-contrast support automatically.

**Files:** `src/lib/theme/ScoutThemeProvider.tsx`, `src/styles/tokens.css`, `src/styles/theme.css`, `src/index.ts`.

**Acceptance:**

- `Program` becomes `"cub" | "scoutsbsa" | "venturing" | "seascouts" | (string & {})` (or a documented extension pattern) so extra programs are assignable without a type error.
- `ScoutThemeProvider` accepts any string value for `program` and sets `data-program` accordingly; components that switch on program fall back gracefully to a sensible default (suggest Scouts BSA tokens) rather than rendering nothing.
- The `forced-colors` block either uses a universal `[data-program]` selector or documents that consumers must add their own forced-colors overrides.
- Typecheck passes; existing four-program stories are visually unchanged.

**Effort:** 2-3 hours.

---

### [x] 2.9 Open variant records on Button, Card, Badge, and Alert

> Done 2026-07-18: took the escape-hatch route. The `className` hatch already
> existed on all four (merged via `cn`/tailwind-merge, so consumer classes land
> ALONGSIDE variant defaults, not instead of them). The gap was reachability:
> the style maps are now exported from the package entry so consumers can spread
> them in a wrapper/cva without touching library source: `buttonVariants`,
> `badgeVariants`, `cardVariants` (cva recipes) and `alertToneStyles` (Alert's
> former private `TONE` record, renamed + exported, plus a new `AlertTone`
> type). No variant behavior changed; stories untouched; typecheck + build pass.

**Why:** `Button`'s `variant` prop is a closed enum (`"primary" | "secondary" | "accent" | "ghost"`). The same pattern applies to `Card`, `Badge`, and `Alert`. Consumers cannot add a variant (e.g. a council "danger" badge or an "outline-accent" button) without forking the component. A discriminated-union approach that hard-codes every string also makes the TS type errors cryptic for newcomers.

**Files:** `src/components/Button.tsx`, `src/components/Card.tsx`, `src/components/Badge.tsx`, `src/components/Alert.tsx`.

**Acceptance:**

- Each component exposes a `classNames` or `className` escape hatch that lets consumers supply fully custom Tailwind classes alongside (not instead of) variant defaults.
- Alternatively, each component exports its `variantStyles` map so consumers can spread it and add entries via `cva` or a wrapper component without touching library source.
- No existing variant behavior changes.
- Typecheck passes; Storybook stories unchanged.

**Effort:** 2-3 hours.

---

### [x] 2.2 Self-hosted fonts as an optional package step

> Done 2026-07-19: added `examples/self-host-fonts/main.tsx` (a copy-pasteable
> app entry with the four `@fontsource-variable` imports for zero third-party
> font requests, plus the tokens/theme imports and a ScoutThemeProvider) and an
> example README. Linked from the README "Fonts" > "Library consumers" section.
> `examples/` is outside the tsconfig include list, so it is not typechecked
> (it references the published package name, which does not resolve locally);
> it is Prettier-clean.

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

### [x] 2.3 Generate framework-neutral token artifacts

> Done 2026-07-19, LIGHTER additive version (agreed with maintainer, not the
> full Style-Dictionary source-of-truth move). Rationale: moving the source into
> tokens/source/\*.json would make tokens.css a generated file and strip the
> brand-guideline citations that CLAUDE.md/ADR 0003 require, and it overlaps the
> hand-authored tokens.print.json from 3.4, all for the marginal benefit of
> "one source." Instead `src/styles/tokens.css` STAYS the authored source of
> truth and everything is generated FROM it, so nothing drifts (guarded by
> `tests/tokens-artifacts.test.ts`). Did NOT adopt style-dictionary (a bespoke
> ~150-line parser in `scripts/tokens-data.mjs` covers the need without a new
> dependency, matching the "no date-fns" minimalism).
>
> Shipped: a typed `TOKENS` export (barrel, mirroring SCOUTING_LINKS; backed by
> the committed-generated `src/lib/tokens/tokens.generated.ts`, prettier-ignored)
> plus three dist file artifacts at package subpaths: `./tokens.json` (full set,
> rgb+hex+values), `./tokens.scss` (Sass color map), `./tokens.email.json`
> (hex-only flat, the data half of 3.8). `build:tokens` script regenerates the
> committed module; the file artifacts are emitted by build-css.mjs AFTER vite
> build (vite empties dist/). README "Tokens as data" section; changeset added.
> Deferred vs the original acceptance: no `.email` CSS (that is 3.8), tokens.css
> is not itself generated, and a full standalone `@opensourcescouting/tokens`
> package is left for if/when a component-free consumer appears.

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

### [x] 2.4 Set up Vitest + jest-axe + contrast assertion tests

> Done 2026-07-03: Vitest (jsdom) + jest-axe wired up; `npm run test` runs 70
> tests (15 files), all green. tests/contrast.test.ts parses tokens.css and
> asserts WCAG ratios across all five palettes; per-component smoke + axe tests
> live in src/**/**tests**. Three genuine bugs surfaced and are flagged with
> it.fails (not silenced): seascouts on-surface-faint originally measured 2.98:1
> (< 3:1 floor) at the old value #7E8FA8; tokens.css:202 comment at the time
> overstated it as ~3.5:1; the token has since been corrected to #7687A0, which
> measures ~3.3:1; Calendar month grid's date-row wrapper lacks role="row" so
> gridcells fail aria-required-parent; and the agenda view nests non-<li>
> AgendaItems inside a <ul>. Test dts excluded from dist; tsconfig.test.json
> typechecks the test tree.

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

> Deferred 2026-07-19: blocked. There is no GitHub remote configured and pushing
> is out of scope, so a Pages-deploy workflow cannot be created meaningfully or
> verified, and no live URL can be added to the README. Revisit once the repo is
> pushed to a GitHub remote with Pages enabled.

**Why:** `build-storybook` exists but no deploy. Marketers and designers
should be able to browse components without cloning the repo.

**Files:** new `.github/workflows/storybook.yml`.

**Acceptance:**

- GitHub Actions workflow on push to main: build Storybook, deploy to
  GitHub Pages (or Chromatic if the user wants visual regression too).
- Public URL added to `README.md` Quick Start section.

**Effort:** 1 hour.

---

### [x] 2.6 Add CHANGELOG and Changesets

> Done 2026-07-19: `@changesets/cli` installed, `changeset init` run, and
> `.changeset/config.json` set to `access: "public"` (scoped package) on
> `baseBranch: main`. Added `.github/workflows/release.yml` (changesets/action:
> opens a "version packages" PR from pending changesets on push to main,
> publishes to npm on merge; needs an `NPM_TOKEN` secret and a GitHub remote,
> neither present yet). Added `version-packages` + `release` npm scripts (avoided
> the reserved `version` name). Added a "Changesets and releases" section (the
> one-paragraph workflow) to the existing `.github/CONTRIBUTING.md`. A real
> changeset for the 2.8/2.9 feature lives at
> `.changeset/open-program-and-variant-api.md` (minor); `changeset status`
> confirms the bump. CHANGELOG already existed (Keep a Changelog); noted the
> adoption there. (Contributor docs CONTRIBUTING/CODE_OF_CONDUCT/SECURITY already
> live under `.github/`, matching the CHANGELOG; my earlier "missing" flag was
> wrong: I had only checked the repo root.)

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

### [x] 2.7 CI: typecheck + test + build on every PR

> Done 2026-07-03: .github/workflows/ci.yml runs on pull_request and push to
> main, Node 22, npm ci, then typecheck + test + build + build-storybook. Mark
> the "verify" check required in branch protection to enforce it before merge.

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
- The `theme.css` base layer removes the hard-coded `color-scheme: light` and
  instead declares both. (Dark composes onto the shadcn tokens: add
  `[data-program].dark` blocks in `tokens.css`.)
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

**Files:** `src/styles/tokens.css`, `src/styles/theme.css`, callers
(`Button`, `Card`, `EventDialog`).

**Acceptance:**

- New `--os-*` tokens per program block:
  - `--os-motion-easing`
  - `--os-motion-duration-fast`
  - `--os-motion-duration-base`
- Map them in `theme.css` `@theme` (v4 namespaces `--ease-program`,
  `--duration-program` / `-slow`); there is no `tailwind.config.ts`.
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

### [x] 3.4 CMYK and Pantone equivalents in tokens

> Done 2026-07-03: created src/styles/tokens.print.json with hex/RGB/CMYK/Pantone for all named brand colors sourced from PDF p.9-14, 22, 25, 28, 31; three PDF discrepancies documented in the file; build-css.mjs emits it to dist/tokens.print.json; README Programs at a glance table gained Pantone columns.

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
Tailwind v4 (container queries are built in; no config or plugin needed).

**Acceptance:**

- FeatureGrid switches column count based on container width, not viewport.
- Calendar may use container queries for the month view threshold (relates
  to task 1.5).
- Stories include narrow-container demos.

**Effort:** 3-4 hours.

---

### [x] 3.6 Open FeatureGrid's per-feature card structure via render slots

> Done 2026-07-19: added `renderFeature?: (feature, index) => ReactNode`. When
> supplied it replaces the per-cell card entirely (wrapped in a keyed Fragment
> so the returned element is the direct grid child); the grid wrapper
> (columns/gap) is unchanged, and the default card JSX is byte-for-byte
> untouched when the prop is omitted. `Feature` was already exported from
> index.ts. Added a `CustomRenderProp` story (linked teaser tiles, bg-primary so
> white text stays AA-safe, whole tile is one aria-labelled link). All 4
> FeatureGrid stories pass in Chromium + axe; typecheck/lint/build green;
> changeset added.

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

**Decision (icon strategy):** We are NOT bundling a general icon catalog.
Lucide (ISC, tree-shakeable) is the recommended set; consumers import glyphs
directly from `lucide-react`. Shipped a general `Icon` primitive that applies
the system's size/stroke/`currentColor`/a11y conventions, with `ProgramIcon`
refactored as a preset on top of it. Documented in the README "Icons" section.
What remains below is the OPTIONAL first-party custom artwork, not a full set.

**Why (remaining):** Lucide is generic. Programs have specific motifs: compass
(Scouts BSA), mountain (Venturing), anchor (Sea Scouts). Custom-drawn glyphs
would be more distinctive than the Lucide stand-ins.

**Files:** new `src/components/icons/*.tsx` or `src/lib/icons/`.

**Acceptance:**

- One React component per program-specific glyph, sized via prop, themed
  via `currentColor` and `--program-*`.
- Storybook page showing the set across all four programs.
- Exported from `src/index.ts`.

**Effort:** 1 day (drawing the icons is the work).

---

### [x] 3.9 Form layer (Tier 0 primitives)

**Shipped:** `Field` (label + help + error, auto-wires id/aria-describedby/
aria-invalid), `TextInput`, `Textarea`, `Select` (styled native), `Checkbox`,
`Switch` (role=switch), and `RadioGroup`/`Radio` (fieldset/legend). Built on
native inputs, themed via program tokens, status colors from the `sa-*` palette.
Exported from `src/index.ts`, stories under `Forms/*`, a11y-tested in
`__tests__/forms.test.tsx`, documented in the README "Forms" section.

**Remaining (later tiers):** Combobox/autocomplete, a Calendar-backed
DatePicker, FileUpload, NumberInput/stepper, OTP/PIN. The custom listbox-style
Select (searchable/multi) belongs with the Tier 1 headless-widget decision.

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

### [ ] 3.13 RTL support audit

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

### [ ] 3.10 ProgramMark asset-probe hardening

**Why:** `ProgramMark` probes up to 15 URLs per render (3 variants x 5
extensions: svg, webp, png, jpg, jpeg) to find a real asset. On SPA-fallback
hosts (e.g. Netlify, Vercel, or any server configured to return 200 + HTML for
missing files), every probe returns a 200 response with an HTML body, so the
extension fallback logic never finds a non-file and keeps rendering the probe
results as broken `<img>` tags instead of falling back to the placeholder.

**Files:** `src/components/ProgramMark.tsx`, `public/marks/README.md`,
`README.md` (deployment warning).

**Acceptance:**

- After fetching a candidate URL, validate the response `Content-Type` header
  (or the image's natural dimensions) before treating it as a valid asset.
  A `text/html` response must be treated as a miss, not a hit.
- Alternatively (or additionally), expose an explicit `src` prop on `ProgramMark`
  so consumers on SPA-fallback hosts can bypass probing entirely and supply the
  resolved URL directly.
- Probe count is reduced: try only the consumer-specified extension first (if a
  `src` or `preferExtension` prop is provided), falling back to the full scan
  only when nothing explicit is given.
- `public/marks/README.md` and `README.md` each carry a warning explaining the
  SPA-fallback behavior and the `forcePlaceholder` / explicit-`src` workarounds.
- Typecheck passes; existing placeholder fallback is unchanged.

**Effort:** 2-3 hours.

---

### [ ] 3.11 Calendar ergonomics

**Why:** Three independent usability gaps in the `Calendar` component:

1. The agenda view window is anchored to `defaultMonth`, not today, so a user
   landing on the calendar in July sees July events even if `defaultMonth`
   is January (from a stale prop). The window should default to today.
2. When the agenda window is empty but events exist outside it (earlier or
   later months), there is no affordance to help the user find them. A "Switch
   to Month view" prompt would surface the navigation controls.
3. `CalendarEvent` has no `allDay` field, so all-day events render with a
   "12:00 AM" time label that misleads users.

**Files:** `src/components/Calendar.tsx`, `src/lib/utils/date.ts`.

**Acceptance:**

- Agenda view defaults the visible window to today's date regardless of
  `defaultMonth` (which should control only the initial month-grid view).
- When the agenda window is empty and the `events` prop contains events outside
  the window, render an inline prompt: "No upcoming events. Switch to Month
  view to browse." Clicking it calls the existing `onViewChange` callback (or
  sets internal view state if uncontrolled).
- `CalendarEvent` gains an `allDay?: boolean` field. When `true`, the time
  label is suppressed in agenda rows and event chips. Existing events without
  the field render as before.
- Typecheck passes; contrast tests still pass.

**Effort:** 2-3 hours.

---

### [x] 3.12 Upgrade to Storybook 9 and adopt the Vitest addon for a11y/component testing

> Done 2026-07-18: went all the way to Storybook 10.5.2 (8.6 -> 9.1 -> 10.5.2;
> 9 was only a mandatory transit checkpoint, not the landing version). Adopted
> `@storybook/addon-vitest`, so stories now run as tests in real Chromium with
> axe. Vitest is split into two projects: a jsdom "unit" project (contrast,
> token-parity, component unit/smoke tests, plus the fast jest-axe inner loop)
> and a browser "storybook" project (stories + axe), with a11y violations
> failing CI (`parameters.a11y.test = "error"`) and `color-contrast` disabled
> there since it is owned by `tests/contrast.test.ts`. `@storybook/test-runner`
> was retired entirely, including its visual-regression job and its axe pass;
> the 171 stale baseline PNGs were removed and are being purged from git
> history. Visual regression is parked (pre-1.0/alpha, manual review for now;
> see the new Tier 4 follow-up). CI now installs Playwright Chromium before the
> test step. Recorded in new ADR 0004 (Accepted); the a11y-testing ADR moved
> from 0004 to 0005 and is now Status: Draft pending revisit after this
> migration.

**Why:** Storybook 9 makes component testing and accessibility testing
first-class through the Vitest addon (the graduated `experimental-addon-test`):
stories run as Vitest browser-mode tests with axe built in, per story. That is
the modern, maintained path and would replace both the jsdom jest-axe suite and
the interim test-runner axe pass (task added alongside 2.4) with one
browser-based suite where the stories are the tests. It also folds
`addon-essentials` into core, shrinks the install, and keeps us aligned with the
shadcn ecosystem tooling.

Deliberately sequenced AFTER the shadcn/Tailwind v4 re-platform so the two major
changes are not entangled, and so the visual-regression retooling it invites is
a conscious decision rather than a rider.

**Benefits:** native per-story a11y (axe) in CI; browser-mode component tests;
lighter/faster install; current with the ecosystem; retires the interim
test-runner axe stopgap.

**Risks / costs:**

- Major version bump. Config migration for `addon-essentials` (folded into
  core), the `globalTypes.program` toolbar, and the `ScoutThemeProvider` preview
  decorator; the `storybook upgrade` codemod handles most but not the custom
  theming decorator.
- Visual regression is currently `@storybook/test-runner` + jest-image-snapshot
  - pinned Playwright container + LFS baselines. SB9's direction (Vitest browser
    mode) uses Playwright's own snapshotting, so moving to it re-tools the pipeline
    we just stabilized. Decide explicitly: keep the test-runner visual job, or
    migrate it too.
- The Vitest addon needs `@vitest/browser` + a Playwright provider, and the
  existing jsdom Vitest suite (unit, contrast, parity) would need a Vitest
  workspace split (a browser project and a node project).

**Files:** `.storybook/main.ts`, `.storybook/preview.tsx`, `package.json`,
`vitest.config.ts` (workspace), `.storybook/test-runner.ts` (retire or keep),
`.github/workflows/*`.

**Acceptance:**

- Storybook 9 runs (`npm run storybook`, `npm run build-storybook`) with the
  program toolbar and ScoutThemeProvider decorator intact.
- The Vitest addon runs stories as browser tests with axe; a11y violations fail
  CI. The interim test-runner axe pass is removed.
- Contrast/parity/unit tests still pass (workspace split as needed).
- Visual-regression decision recorded (kept on test-runner, or migrated).
- CLAUDE.md and README updated for the new test commands.

**Effort:** 1-2 days.

**Prerequisites:** Vitest 3+ (have 3.2.6) and Node 20+ (have 22) are already
satisfied. Land after the re-platform merges.

---

## Tier 4: nice-to-have

### [x] 4.1 Visual regression (done, substituted for Chromatic)

Catches per-program rendering regressions across the component x program
matrix that no human reviewer will catch reliably. Chose self-hosted
Playwright via `@storybook/test-runner` + `jest-image-snapshot` over Chromatic
to avoid SaaS snapshot limits and vendor lock-in. Every story is screenshotted
at 375 / 768 / 1280 in a `postVisit` hook and diffed against committed
baselines under `.storybook/__image_snapshots__/`. Determinism comes from
running both baseline generation and CI inside the pinned Playwright container
(`mcr.microsoft.com/playwright:v1.61.1-jammy`). See
`.storybook/VISUAL_REGRESSION.md` and `.github/workflows/visual.yml`.
**Effort:** done.

### [ ] 4.2 Rebuild visual regression on addon-vitest / Playwright

**Why:** retired in the Storybook 10 upgrade (task 3.12, ADR 0004) along with
`@storybook/test-runner`; parked since the project is pre-1.0/alpha and manual
review covers it for now.

**How:** use Playwright's own `toHaveScreenshot` in the browser "storybook"
Vitest project, or a dedicated screenshot job; generate baselines in a pinned
Linux container for determinism.

**Effort:** ~1 day.

### [ ] 4.3 `examples/` directory with reference integrations

Subdirectories: `nextjs-app/`, `vanilla-html/`, `wordpress-block-theme/`,
`mailchimp-email/`. Each is a minimal working consumer of the package.
**Effort:** 1-2 days.

### [ ] 4.4 Figma library generated from token JSON

Use Tokens Studio plugin to consume `dist/tokens/tokens.json`. Closes the
designer ↔ engineer loop.
**Effort:** 1 day (mostly Figma work).

### [ ] 4.5 `prefers-contrast: more` overrides

Boost contrast tokens when users opt in. WCAG 2.2 SC 1.4.6 (AAA), increasingly
expected on government/nonprofit sites.
**Effort:** 2 hours.

### [ ] 4.6 Imagery component with brand contract

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
