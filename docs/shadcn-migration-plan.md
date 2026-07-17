# shadcn re-platform: migration plan

Executes [ADR 0002](./decisions/0002-adopt-shadcn-patterns.md) (adopt shadcn
patterns) and [ADR 0003](./decisions/0003-tailwind-v4.md) (Tailwind v4).
Guiding principle throughout: **minimize and codify the deltas from standard
shadcn** (the delta register in ADR 0002 is the contract).

Status: not started. Each phase lands green (lint, typecheck, test, build) and
is separately committable. Order matters: the token spike de-risks everything
after it.

## Context snapshot for executors (state as of 2026-07-17)

Everything a fresh session needs that is not obvious from the code.

### Repo state

- The 2026-07-17 working session landed as ONE large local commit (DX/OSS
  files, root declutter into demo/ + docs/, the openscouting ->
  opensourcescouting rename, logo/favicon assets, Icon + ProgramIcon refactor,
  the form layer, the Radix themed Select, the links module, these ADR/plan
  docs). It is local only: nothing has been pushed, so history can still be
  reshaped before the first push if finer-grained commits are wanted.
- History WAS rewritten this session (git lfs migrate); baselines live in
  **Git LFS** (`.gitattributes` routes `.storybook/__image_snapshots__/*.png`).
  `visual.yml` checks out with `lfs: true`.
- **Visual baselines are already stale**: new stories (MadeWithBadge, Icon,
  Forms/*, themed Select) have no baselines, and the DecorativeBorder ->
  DecorativeDivider rename orphaned old PNGs. Regeneration must happen in the
  pinned Playwright container (`.storybook/VISUAL_REGRESSION.md`); the tag in
  `visual.yml` must match the lockfile Playwright version. Phase 6 regenerates
  everything anyway, so do not bother regenerating before then unless CI must
  be green earlier.

### Current architecture facts the plan builds on

- Tokens: `src/styles/tokens.css`, one `:root` (parent brand) + four
  `[data-program="..."]` blocks + a `forced-colors: active` block. Values are
  space-separated RGB triplets consumed as `rgb(var(--x))` (v3 preset maps
  them; `bg-program-primary/80` relies on this format). Cite brand-guideline
  page numbers in comments: preserve those citations when porting.
- Status colors intentionally come from the raw `sa-*` palette (see
  `Alert.tsx`), not program tokens: system feedback reads the same across
  programs. Map `--destructive` from `sa-red`; keep this invariant.
- Brand constants used by MadeWithBadge and the OSS logo: green `#245235`,
  amber `#D0932B` (these are OUR project colors, unrelated to program tokens).
- `useScoutTheme()` throws without a `ScoutThemeProvider` ancestor. Storybook
  preview wraps all stories in it (`.storybook/preview.tsx`) with a
  `globalTypes.program` toolbar; keep that working through the migration.
- **Portal re-stamping pattern** (delta 9) is already implemented once in
  `src/components/Select.tsx`: `<RS.Content data-program={program} ...>` with
  `program` from `useScoutTheme()`. Reuse/factor this for every portalled
  widget.
- `NativeSelect` (was `Select` pre-Radix) pins `[color-scheme:light]` so the
  OS-rendered popup never flips dark: keep that behavior.
- `radix-ui` v1.6.x is installed as a single package (namespace imports like
  `import { Select as RS } from "radix-ui"`), is a runtime `dependency`, and
  is **externalized** in `vite.config.ts` rollupOptions plus given a global.
  Any new runtime dep (e.g. `cva`, `sonner`) needs the same externalization
  decision made consciously.
- `Field` (src/components/Field.tsx) provides context (id, describedBy,
  invalid, required, disabled) consumed by TextInput/Textarea/Select/
  NativeSelect/Checkbox/Switch; `controlClasses()` there is the shared input
  skin. Phase 3 decides its fate vs shadcn Form.
- Build: Vite lib mode, entry `src/index.ts`, CSS built separately by
  `scripts/build-css.mjs` (lib mode cannot take CSS as rollup input; we want
  fully Tailwind-processed output). `publicDir` is disabled for the library
  build ON PURPOSE (public/marks/ must never ship in the tarball: legal).
- Dev showcase lives in `demo/` (`index.html`, `main.tsx`, `App.tsx`); Vite
  `root` points there for `dev`/`build:demo` only. Demo imports the library
  via the `@` alias. Library build stays rooted at the project root.
- Three tsconfigs (project incl. demo + .storybook / node / test); typecheck
  runs all three.

### Conventions and tooling

- Node >= 22 (`.nvmrc`), npm only. Prettier printWidth **100** (config in
  `.prettierrc.json`, mirrored by `.editorconfig`); `npm run lint` is the CI
  check, `npm run format` fixes. cSpell diagnostics in editors are noise.
- Conventional Commits; messages explain why. NO em-dashes or en-dashes in any
  output or file (user rule; use colons/commas/hyphens).
- Verify loop: `npm run lint && npm run typecheck && npm run test && npm run
build`. 82 tests across 17 files as of this snapshot, all green.
- Accessibility gates: tests include jest-axe smoke tests and contrast-ratio
  assertions (`tests/contrast.test.ts`); Phase 1 repoints these at the new
  token names FIRST.
- Package: `@opensourcescouting/design-system` (npm org registered
  2026-07-17). Never write "openscouting": collides with a dead project.
- README consumer docs (Tailwind wiring section) describe the v3 preset path
  and become wrong at Phase 2; rewrite in Phase 6 (or earlier if publishing).

### Known pending items outside this migration

- Replace reporting-contact placeholder: CoC/SECURITY route via GitHub private
  vulnerability reporting (enable in repo Settings -> Security when pushed);
  a dedicated email arrives when the project domain exists.
- GitHub org avatar + social preview upload (assets ready:
  `public/oss/opensourcescouting-social-preview.png`, android-chrome-512).
- 16px favicon legibility: the full compass muddies at 16px; a simplified
  small-size glyph was proposed but not built.
- TODO 3.7 (custom program glyph artwork) and TODO 3.8 (email-safe CSS)
  remain open; links module may grow more URLs (only add user-confirmed
  canonical URLs; scouting.org 403s automated fetchers).

## Phase 0: Spike (de-risk the core idea)

Prove the multi-program token mechanism end-to-end on a throwaway branch before
committing to the rewrite.

- Tailwind v4 build wired up (`@tailwindcss/vite`) for dev + Storybook only.
- shadcn token names defined under `:root` and two `[data-program]` blocks.
- One stock shadcn primitive (Button) and one Radix recipe (DropdownMenu)
  rendered in Storybook across those programs.
- Exit criteria: both components theme correctly per program with zero
  per-component edits; contrast tests pass against the mapped values; no
  Storybook/Vite integration blockers.
- If the spike fails, stop and revisit ADR 0002 rather than forcing it.

## Phase 1: Token architecture

- Re-express `src/styles/tokens.css` in shadcn's vocabulary per program
  (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`,
  `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`,
  chart/sidebar tokens as needed), values from the brand guidelines with the
  page-number citations preserved.
- Curated semantic mapping (ADR 0002 delta 4): shadcn `--accent` is the muted
  hover wash (from surface-muted), NOT brand gold. Brand accent, contrast
  tiers, rule weight, and decor move to the `--os-*` extended vocabulary
  (delta 3).
- Keep the `forced-colors: active` block.
- Update contrast tests to assert against the new names BEFORE porting
  components, so regressions surface immediately.

## Phase 2: Build pipeline (Tailwind v4)

- Replace PostCSS setup with `@tailwindcss/vite` in `vite.config.ts` and
  `.storybook`. Configuration moves into CSS (`@theme` + our token files);
  retire `tailwind.config.ts`, `tailwind-preset.cjs`, `tailwind-preset.d.cts`,
  `postcss.config.js`.
- Rework `scripts/build-css.mjs` for the v4 pipeline; keep emitting
  `dist/styles.css`, `dist/tokens.css`, `dist/tokens.print.json`.
- Update `package.json` exports: drop `./tailwind-preset`, document the
  CSS-first consumer contract.
- Storybook, dev showcase, and the library build all green before moving on.

## Phase 3: Primitives on shadcn recipes

Rebuild on the shadcn recipe (API + `cva`), carrying our values and guards:

- `Button` (keep delta 5: type-level accent+sm exclusion and dev warning),
  `Badge`, `Alert`, `Card` family.
- Form layer: adopt shadcn's Input/Textarea/Select/Checkbox/Switch/RadioGroup/
  Label/Form APIs. Decide per component whether our `Field` context survives as
  a thin layer over shadcn Form or is retired; record the outcome in ADR 0002's
  delta register either way.
- Keep `NativeSelect` as the zero-JS escape hatch.

## Phase 4: Tier 1 widgets from recipes

- Adopt: Tabs, Accordion, Tooltip, Popover, DropdownMenu, Dialog, AlertDialog,
  Toast (Sonner, per shadcn current), NavigationMenu.
- Re-verify the themed `Select` against the stock recipe and reduce it to
  recipe + tokens if possible.
- Every portalled component re-stamps `data-program` (delta 9); factor a shared
  helper so it cannot be forgotten.

## Phase 5: Domain components reskinned

- ProgramHero, EventCard, RegistrationCTA, Calendar, DecorativeDivider,
  ProgramMark, ScoutingAmericaWordmark, MadeWithBadge: swap class references to
  the new token names; rebuild `EventDialog` on the Dialog recipe (retiring the
  native `<dialog>` implementation, per ADR 0002).
- Theme nesting re-verified (a Venturing card inside a Scouts BSA page).

## Phase 6: Docs, baselines, cleanup

- Regenerate ALL visual-regression baselines in the pinned Playwright
  container; delete orphaned ones.
- Rewrite README (Tailwind wiring, theming, forms, new widgets), CLAUDE.md
  (conventions: cva, token names, delta register pointer), BRAND-GUIDE token
  table, CHANGELOG.
- Sweep for stragglers: `bg-program-*` classes, preset references, dead files.

## Explicitly out of scope (tracked separately)

- Dark mode per program (composes onto the new tokens; TODO 3.1).
- Combobox/Command/Data Table adoption (post-migration wins).
- Any change to the brand-asset legal model or the links data module.
