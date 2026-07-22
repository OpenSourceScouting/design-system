# Contributing

Thanks for helping improve the Open Source Scouting Design System. This is a
community project maintained by registered Scouting volunteers. It is not an
official Scouting America product (see the notice in the [README](../README.md)).

By participating you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Before you start

- Browse the [`TODO.md`](../docs/TODO.md) backlog for ready-to-pick work, or open an
  issue to discuss a change first. For anything beyond a small fix, an issue
  saves you from building something we can't merge.
- Read [`CLAUDE.md`](../CLAUDE.md). It documents the theming architecture,
  accessibility rules, and brand-asset constraints that every change must
  respect. It is written for AI agents but is the most concise map of the
  codebase's non-obvious rules.

## Prerequisites

| Tool                | Version | Notes                                                    |
| ------------------- | ------- | -------------------------------------------------------- |
| Node                | `>=22`  | The repo pins the 22 LTS via `.nvmrc` (`nvm use`).       |
| npm                 | `>=10`  | No pnpm or yarn. The committed `package-lock.json` wins. |
| Playwright Chromium | n/a     | **Required.** See below; `npm run test` needs it.        |

`npm run test` runs a Vitest project named `storybook` that executes every
Storybook story as a test in a real Chromium instance (via
`@storybook/addon-vitest`), including an axe accessibility pass. Without the
Chromium binary installed, that project fails immediately and `npm run test`
cannot pass locally.

## Setup

```bash
git clone <your-fork-url>
cd cubscout-branding
nvm use                          # picks up .nvmrc (Node 22)
npm ci                           # clean install from the lockfile
npx playwright install chromium  # one-time, needed for the storybook test project
```

CI installs the Chromium binary explicitly as a separate step before running
`npm run test`; do the same locally so you are not surprised by a passing PR
that fails on your machine (or vice versa).

### Brand assets (important, legal-sensitive)

Real Scouting America / BSA marks are **not** in this repository and must never
be committed. The `.gitignore` blocks `public/marks/*`. Components render
original placeholder marks by default; drop licensed assets into `public/marks/`
locally to preview the real thing. See [`NOTICE.md`](../NOTICE.md) for the full
asset model and the brand guidelines PDF (also gitignored, download link in
[`research/README.md`](../research/README.md)).

Do not recolor official marks via CSS: that produces a derivative work the BSA
license forbids. See the "Brand asset model" section of `CLAUDE.md`.

## Development loop

```bash
npm run dev          # Vite showcase (App.tsx demo) at http://localhost:5173
npm run storybook    # Storybook 10 component lab at http://localhost:6006
```

Restart Storybook after editing anything under `.storybook/`: HMR does not
cover `main.ts` / `preview.tsx` changes.

## Testing

`npm run test` (`vitest run`) runs two Vitest projects defined in
`vitest.config.ts`, and both must pass:

- **`unit`** (jsdom, no browser): contrast-ratio math (`tests/contrast.test.ts`),
  per-program token-parity (`tests/token-parity.test.ts`), and component
  behavior/logic tests under `src/components/__tests__/`. Fast inner loop; run
  it alone with `npx vitest --project unit`.
- **`storybook`** (real Chromium, via `@storybook/addon-vitest`): every story in
  the library runs as a test, with an axe accessibility pass (roles, names,
  ARIA, focus) on top. Run it alone with `npx vitest --project=storybook`.

**The key rule: a new component needs a story.** The story is what the
`storybook` project scans, so it is the required accessibility coverage for
that component; there is no separate jsdom a11y check to fall back on.
Accessibility violations caught here fail CI. Color contrast is deliberately
excluded from this pass and owned instead by `tests/contrast.test.ts` and the
contrast kitchen-sink story: see
[ADR 0005](../docs/decisions/0005-accessibility-testing-strategy.md) for the
full division of labor and why it is split this way.

## Before you open a pull request

Run the same checks CI runs. All four must pass:

```bash
npm run lint         # Prettier formatting check
npm run typecheck    # tsc across the project, node, and test configs
npm run test         # Vitest: unit project + storybook (real-browser) project
npm run build        # verifies the library + CSS build is clean
```

`npm run format` auto-fixes any formatting the linter flags. Formatting is
Prettier-owned and mirrored in `.editorconfig`; do not hand-format against it.

### Visual regression is parked

There is currently no automated visual (pixel-diff) regression suite. A
previous `@storybook/test-runner` + `jest-image-snapshot` pipeline against
committed PNG baselines was retired during the Storybook 10 migration: the
test-runner approach doesn't carry forward cleanly onto
`@storybook/addon-vitest`, and the project is pre-1.0 (alpha), so visual
regressions are caught by manual review (`npm run storybook`, then eyeball
across the program toolbar) instead. See
[`.storybook/VISUAL_REGRESSION.md`](../.storybook/VISUAL_REGRESSION.md) for
the full history and what would be involved in bringing it back. Do not add
or update image baselines as part of a PR; there is no baseline mechanism to
target.

## Adding a component

1. Create `src/components/YourThing.tsx`. Use the `cva` recipe idiom for
   variants (see `Button`, `Badge`, `Card`) and resolve colors to the shadcn
   semantic tokens or the `--os-*` extended tokens, never hardcoded colors.
   Use `text-muted-foreground` or `text-os-on-surface-faint` for de-emphasized
   text, not an opacity tint below `/80` (it fails contrast).
2. Add `src/components/YourThing.stories.tsx` alongside it. This is not
   optional: it is the accessibility coverage the `storybook` Vitest project
   depends on (see Testing above).
3. If the component is a Radix portalled widget (Dialog, Popover,
   DropdownMenu, Tooltip, Select, and similar), spread `useProgramStamp()`
   (from `ScoutThemeProvider`) onto every portalled `*.Content` so the themed
   `data-program` attribute survives the portal to `document.body` (ADR 0002
   delta 9).
4. Export the component (and its prop types) from `src/index.ts`.
5. If there is non-visual behavior worth testing (fallback logic, date math,
   dev-mode warnings), add a unit test in `src/components/__tests__/`. This is
   for logic, not accessibility: the story already covers a11y.
6. Run `npm run typecheck`, `npm run lint`, and `npm run test` before opening
   the PR.

## Adding a program

Scouting America's four program sub-brands plus the parent brand are additive:
adding a fifth program (or a new parent-brand variant) should never require
touching component code. To add one:

1. Add a `[data-program="..."]` block to `src/styles/tokens.css` with the full
   token set. `tests/token-parity.test.ts` enforces that every program block
   defines an identical set of tokens, so copy an existing block as a starting
   point and cite the brand-guidelines page number for each value.
2. Add the program to `PROGRAMS` and `PROGRAM_META` in
   `src/lib/theme/ScoutThemeProvider.tsx`.
3. Add it to the palette arrays in the token tests
   (`tests/contrast.test.ts`, `tests/token-parity.test.ts`).

## Commit and PR conventions

- **[Conventional Commits](https://www.conventionalcommits.org/)**: prefix with
  `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, or `chore:`.
- Explain **why** in the message body, not just what changed.
- Keep PRs focused. One logical change per PR is much easier to review.
- Per-program differences belong in CSS-variable overrides in
  `src/styles/tokens.css`, never in component logic. Cite the brand guidelines
  page number for token values.
- Respect the accessibility guardrails documented in `CLAUDE.md` and the README
  (contrast tokens, no `variant="accent" size="sm"`, no sub-`/80` text tints).

## Changesets and releases

We use [Changesets](https://github.com/changesets/changesets) to version the
package and generate release notes, so **any PR that changes published behavior
must include a changeset**: run `npx changeset`, choose the bump type (`patch`
for fixes, `minor` for additions; we are pre-1.0, so breaking changes are still
`minor`), and write a short human-readable summary. That creates a markdown file
under `.changeset/` which you commit alongside your code. Docs-only,
tooling-only, and test-only changes do not need a changeset.

**Releases are deliberate, not automatic.** Merging to `main` only accumulates
changesets; nothing is published. When a release is ready, a maintainer runs the
`Release` workflow from the Actions tab (`workflow_dispatch`, main only). The
workflow re-runs the full CI gate, then (behind the `npm-publish` environment's
required-reviewer approval) consumes the changesets, commits the version bump
and `CHANGELOG.md`, publishes to npm with Sigstore provenance, generates a
CycloneDX SBOM (Syft), attests the tarball and SBOM, and creates a GitHub
Release with both attached. A `dry-run` input previews the whole release
(version, build, pack, SBOM, `npm publish --dry-run`) without publishing
anything. While `.changeset/pre.json` is present the package is in prerelease
mode and publishes under the `alpha` dist-tag; exit it with
`npx changeset pre exit` (committed like any change) before cutting a stable
release.

## Housekeeping

Rebasing or amending can leave orphaned objects that bloat `.git`. Run
`npm run maintenance:git` occasionally to prune them (it only removes
unreachable objects; committed history is never touched). `npm run clean`
removes build output (`dist/`, `storybook-static/`, caches).
