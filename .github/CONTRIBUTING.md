# Contributing

Thanks for helping improve the Scouting America Design System. This is a
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

| Tool    | Version | Notes                                                    |
| ------- | ------- | -------------------------------------------------------- |
| Node    | `>=22`  | The repo pins the 22 LTS via `.nvmrc` (`nvm use`).       |
| npm     | `>=10`  | No pnpm or yarn. The committed `package-lock.json` wins. |
| Git LFS | any 3.x | **Required.** Visual-regression baselines are in LFS.    |

Git LFS is not optional. The 171 PNG baselines under
`.storybook/__image_snapshots__/` are stored in Git LFS. If you clone without
`git-lfs` installed, those files check out as tiny pointer text files and the
visual tests will fail with confusing diffs.

## Setup

```bash
# Install git-lfs first if you haven't (https://git-lfs.com):
#   macOS:   brew install git-lfs
#   Ubuntu:  sudo apt-get install git-lfs

git clone <your-fork-url>
cd cubscout-branding
git lfs install          # one-time, enables the LFS filters
git lfs pull             # ensure baseline PNGs are real images, not pointers
nvm use                  # picks up .nvmrc (Node 22)
npm ci                   # clean install from the lockfile
```

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
npm run storybook    # Storybook 8 component lab at http://localhost:6006
```

## Before you open a pull request

Run the same checks CI runs. All four must pass:

```bash
npm run lint         # Prettier formatting check
npm run typecheck    # tsc across the project, node, and test configs
npm run test         # Vitest: contrast ratios, axe smoke tests, unit tests
npm run build        # verifies the library + CSS build is clean
```

`npm run format` auto-fixes any formatting the linter flags. Formatting is
Prettier-owned and mirrored in `.editorconfig`; do not hand-format against it.

### Visual regression

If your change alters rendered output, the visual-regression suite will diff
against the committed baselines and fail. That is expected. To review and
update baselines, follow [`.storybook/VISUAL_REGRESSION.md`](../.storybook/VISUAL_REGRESSION.md)
exactly: baselines must be regenerated inside the pinned Playwright container so
font rendering matches CI, then committed (they land in Git LFS automatically).
Never commit baselines generated on your host OS: antialiasing differences will
make CI red for everyone.

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

## Housekeeping

Rebasing, amending, or refreshing binary baselines can leave orphaned objects
that bloat `.git`. Run `npm run maintenance:git` occasionally to prune them
(it only removes unreachable objects; committed history is never touched).
`npm run clean` removes build output (`dist/`, `storybook-static/`, caches).
