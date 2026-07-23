# 0007. Tag-driven releases with semantic-release

Date: 2026-07-23
Status: Accepted

## Context

The release process (`.github/workflows/release.yml`) used Changesets:
contributors added changeset files, and the release workflow ran
`changeset version` in CI, committed the version bump and `CHANGELOG.md`, and
pushed that commit directly to `main` (`git push origin HEAD:main`).

That push is incompatible with the branch protection the project wants for
`main`: require a pull request, block force pushes, allow no bypass actors.
A workflow that pushes commits straight to `main` needs an admin-level bypass
of that protection, which defeats the point of the ruleset. Something had to
change: either grant CI a standing bypass on `main`, or stop needing CI to
write to `main` at all.

Facts on the ground made the second option easy: the package is not yet
published to npm (404), the repository has zero git tags, and the ten pending
changesets were never released, so nothing has to be preserved for existing
consumers.

## Decision

Remove the need for CI to ever write to `main` by moving the source of truth
for versions and changelogs out of repository files:

- Version truth lives in git tags (`v*`), not `package.json`. The
  `package.json` `version` field becomes vestigial between releases;
  semantic-release stamps the real version into the published tarball.
- Changelog truth lives in GitHub Releases, not `CHANGELOG.md`.
- Change-impact metadata is captured in Conventional Commit messages, produced
  by squash-merging pull requests with conventional titles (`feat:`, `fix:`,
  `feat!:` for breaking changes). Contributors need no release knowledge; the
  maintainer normalizes the title at merge time. A CI check
  (`pr-title.yml`, using `amannn/action-semantic-pull-request`) validates the
  title on every PR.
- `semantic-release` derives the next version from those commits since the
  last tag (`fix` = patch, `feat` = minor, `feat!` or a `BREAKING CHANGE`
  footer = major), publishes to npm, creates the `v*` tag, and creates the
  GitHub Release with generated notes. It is configured without the
  `@semantic-release/git` plugin, so it never commits anything to the
  repository.
- Releases stay deliberate rather than automatic on every merge: the workflow
  remains `workflow_dispatch`, triggered by a maintainer, gated by the
  existing `npm-publish` environment and its required reviewer.
- Changesets, `.changeset/`, and `CHANGELOG.md` are removed entirely.
- Hand-editing of notes happens after publish, by editing the GitHub Release
  directly (release notes are mutable forever). `draftRelease` is
  deliberately not used: a draft would leave npm published with no visible
  notes if a human forgets to click Publish.

## Alternatives considered

- **Ruleset bypass via a deploy key or app.** Grant the release workflow a
  standing bypass on the `main` branch ruleset so it can keep pushing version
  commits. Rejected: it reintroduces exactly the write path the ruleset
  exists to close, and a bypass actor on the branch ruleset is explicitly out
  of scope for this project's protection goals.
- **Keep Changesets, add a "Version Packages" PR instead of a direct push.**
  Changesets supports opening a PR with the version bump instead of pushing
  straight to `main` (the pattern used by `changesets/action`). Rejected for
  now: it still requires a human (or bot) to merge that PR before every
  release, keeps `CHANGELOG.md` and `package.json` version churn as
  reviewable diffs contributors do not otherwise touch, and does not remove
  the underlying two sources of truth (commits and files) that this decision
  wants to collapse into one (commits only).
- **release-please.** Google's release-please also automates version bumps
  and changelogs from Conventional Commits, and also proposes changes via a
  standing "release PR" rather than a direct push. Rejected for the same
  reason as the changesets-PR alternative: an extra PR-merge step in the
  release path, and it manages `CHANGELOG.md` as a committed file, which this
  decision moves out of the repository.

## Consequences

- The `package.json` `version` field is vestigial after this migration; it is
  not bumped by any automated process and should not be read as the current
  published version. The published version is whatever the latest `v*` tag
  and the npm dist-tags say.
- Release notes are generated automatically by semantic-release's
  conventional-commits preset from squash-merge commit messages. A maintainer
  can still improve them after the fact by editing the GitHub Release; there
  is no changelog file to keep in sync.
- Semver bumps are derived entirely from commit types, so PR titles carry
  real weight: a mistitled PR produces a wrong (or missing) version bump.
  This is mitigated by the required `pr-title.yml` check and by the
  maintainer normalizing the title at squash-merge time.
- The project stays in the `alpha` prerelease channel
  (`.releaserc.json` `prerelease: "alpha"`) to match the current pre-1.0
  posture. Graduating to a stable release later means removing the
  `prerelease` and `channel` keys from `.releaserc.json`; the next
  semantic-release run then cuts the first stable version (expected
  `1.0.0`, since nothing has published a stable release yet).
- Contributors lose the ability to write their own release-note summaries at
  PR time (Changesets' per-PR summary file); notes are now generated from
  commit subjects, edited post-publish if a subject reads poorly in the
  final notes.
- This does not change anything about squash-merge enforcement, branch
  rulesets, or tag protection; those are tracked separately as the follow-on
  repository-settings work, since they require GitHub admin rights.
