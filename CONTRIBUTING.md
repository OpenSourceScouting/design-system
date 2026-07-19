# Contributing

Thanks for helping improve the Scouting America Design System. This is a
community project; councils, volunteers, and staff are all welcome.

## Before you start

- Read [`CLAUDE.md`](./CLAUDE.md). It documents the hard rules that are easy to
  get wrong from a quick skim: the `data-program` theming model, the brand-asset
  legal rules, and the contrast tokens.
- Node >=22 and npm >=10 (see `.nvmrc`). No pnpm/yarn.
- Install with `npm ci`.

## Local workflow

```bash
npm run dev          # Vite showcase (demo/App.tsx) at http://localhost:5173
npm run storybook    # component lab at http://localhost:6006
npm run typecheck    # tsc across the three configs
npm run test         # Vitest: jsdom unit + real-Chromium story/a11y projects
npm run build        # full library build; use to verify final correctness
npm run format       # Prettier write (npm run lint checks)
```

Before opening a PR, `npm run typecheck` and `npm run build` must both pass, and
`npm run lint` must be clean.

## Ground rules

- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
  `chore:`). Explain _why_ in the body, not just what changed.
- **No em-dashes or en-dashes** anywhere: prose, code, comments, commits. Use a
  colon, comma, parentheses, or a plain hyphen for ranges.
- **Never commit files under `public/marks/`** (real BSA marks are gitignored
  and legally sensitive; only `README.md` is allowed there). See `NOTICE.md`.
- Every new component needs a Storybook **story** (that is the required a11y
  coverage); a jsdom unit test is for non-a11y logic.

## Changesets (release notes and versioning)

We use [Changesets](https://github.com/changesets/changesets) to version the
package and generate release notes, so **any PR that changes published behavior
must include a changeset**. After making your change, run `npx changeset`,
pick the bump type (`patch` for fixes, `minor` for additions, `major` for
breaking changes: we are pre-1.0, so breaking changes are still `minor`), and
write a short human-readable summary. This creates a markdown file under
`.changeset/` that you commit alongside your code. On merge to `main`, the
Release workflow collects pending changesets into a "version packages" PR;
merging that PR bumps the version, updates `CHANGELOG.md`, and publishes to npm.

Docs-only, tooling-only, or test-only changes do not need a changeset.
