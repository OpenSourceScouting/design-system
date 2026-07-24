# Release process

This document describes how versions of `@opensourcescouting/design-system`
get published. It is maintainer-facing; contributors do not need any of this
beyond writing a Conventional Commit style PR title (see
`.github/CONTRIBUTING.md`). For the reasoning behind this process and the
alternatives considered, see
[ADR 0007](./decisions/0007-tag-driven-releases-with-semantic-release.md).

## Overview

Nothing about a release lives in a repository file:

- **Version truth lives in git tags** (`v*`), not `package.json`. The
  `version` field in `package.json` is vestigial between releases; do not
  read it as "the current version."
- **Changelog truth lives in GitHub Releases**, not `CHANGELOG.md`. There is
  no changelog file to update.
- **Change-impact metadata comes from Conventional Commit messages.** PRs are
  squash-merged, and the PR title becomes the commit message on `main`
  (`fix:`, `feat:`, `feat!:`, etc.).
- **`semantic-release` automates the rest**: it reads commits since the last
  tag, computes the next version, publishes to npm, creates the tag, and
  creates the GitHub Release with generated notes.
- **CI never writes to `main`.** semantic-release runs without the
  `@semantic-release/git` plugin, so no automated commit or push ever lands
  on `main`. This is what makes the process compatible with a branch ruleset
  that has no bypass actors.

## For contributors

You do not manage versions, changelogs, or release notes. All you need to do
is open a PR with a title in Conventional Commit format:

- `fix: ...` for a bug fix
- `feat: ...` for a new feature or capability
- `feat!: ...` or a `BREAKING CHANGE:` footer in the PR description for a
  breaking change
- `docs:`, `chore:`, `refactor:`, `test:`, etc. for everything else (these do
  not trigger a version bump)

A required CI check (`pr-title.yml`) validates the title format on every PR
and re-checks it if you edit the title later. A maintainer may still adjust
the title at merge time if it needs normalizing. Nothing else is required of
you: no changeset file, no `CHANGELOG.md` edit.

## How a maintainer cuts a release

1. Open the **Actions** tab and dispatch the **Release** workflow from
   `main`.
2. Optionally set `dry-run: true` first. A dry run runs the full CI gate and
   `semantic-release --dry-run`, which prints the version it would compute
   and the notes it would generate, without tagging, publishing, or creating
   anything.
3. The `release` job is gated by the `npm-publish` environment: approve the
   deployment when prompted.
4. `semantic-release` then:
   - computes the next version from commits since the last `v*` tag
   - publishes the package to npm with Sigstore provenance
   - creates the `v*` tag and a GitHub Release with generated notes
5. The workflow generates a CycloneDX SBOM (Syft), attests the tarball and
   SBOM (GitHub artifact attestations), and uploads both as assets on the
   GitHub Release.
6. If a release was actually produced (not a dry run, and there were
   releasable commits), the `deploy-storybook` job publishes the Storybook
   build to GitHub Pages so the hosted component lab matches the version
   just published. It does this by calling the shared `deploy-docs.yml`
   reusable workflow (see below), so a release deploy and a manual docs
   refresh always build the page identically.

## Publishing the docs page on its own

The hosted component lab
(`https://opensourcescouting.github.io/design-system/`) is built and deployed
by the reusable **`deploy-docs.yml`** workflow. The release above calls it
after a real npm release, but you can also publish the page by itself, without
cutting a release, for docs-only or metadata updates: new social-preview /
SEO tags, story copy, an Introduction MDX edit, or anything else that only
changes what the hosted Storybook shows.

To do this, dispatch the **Deploy Docs** workflow from the **Actions** tab on
`main` (it exposes a `workflow_dispatch` trigger for exactly this). It rebuilds
Storybook with the Pages subpath config and overwrites the live site. Because
the page is not versioned, the npm package version is unaffected.

Use this path when your change would not (and should not) produce a version
bump but still needs to show up on the hosted page. A `docs:`/`chore:` PR
merged to `main` does not deploy anything on its own; dispatch **Deploy Docs**
when you want it live.

## How version bumps are decided

`semantic-release` reads the Conventional Commit type of every commit since
the last tag:

- `fix:` -> patch bump
- `feat:` -> minor bump
- `feat!:` or a `BREAKING CHANGE:` footer -> major bump
- everything else (`docs:`, `chore:`, `refactor:`, `test:`, ...) -> no bump

If several commits landed since the last tag, the highest-impact one wins
(one `feat` and several `fix`es still produce a minor bump).

**Current posture: 0.x from main.** `.releaserc.json` sets
`"branches": ["main"]`, so `main` is a normal release branch: versions
publish as plain `0.x` semver (`0.2.0`, `0.2.1`, `0.3.0`, ...) under the
`latest` npm dist-tag. A `0.x` major already signals a pre-1.0, unstable API
per semver, so no separate prerelease channel is used. The move to `1.0.0`
happens whenever a `feat!`/`BREAKING CHANGE` commit lands (or you can cut it
deliberately with one). If you later want a dedicated prerelease track (an
`alpha`/`beta` channel), add a prerelease branch alongside `main`; see
ADR 0007 and the semantic-release branch docs.

## Editing release notes after the fact

Release notes are generated automatically from commit subjects, but they are
not frozen. If a note reads poorly or needs more context, edit the GitHub
Release directly on github.com; there is no source file to keep in sync.

## Troubleshooting

- **"No release was produced" in the workflow summary.** This means there
  were no releasable commits (`fix:`, `feat:`, or a breaking change) since
  the last tag. Commits like `docs:` or `chore:` alone do not trigger a
  release. This is expected, not an error.
- **The version jumped more than expected** (for example straight to a new
  major version). A `feat!:` or `BREAKING CHANGE:` commit landed since the
  last tag. Check the generated release notes for which commit triggered it
  before assuming something is wrong.

## One-time setup (not covered here)

Squash-only merge settings, the branch ruleset on `main`, the tag ruleset for
`v*`, the `npm-publish` environment configuration, the baseline tag, and
migrating to npm trusted publishing are one-time, admin-level repository
settings. They are tracked in
[`docs/release-migration-plan.md`](./release-migration-plan.md) (Phases B and
C) and are out of scope for this document.
