# Release process migration plan: changesets to tag-driven semantic-release

Status: approved design, ready to execute.
Decided: 2026-07-23, in conversation with the maintainer.
Execute steps in order. Each phase ends with a verification gate; do not
proceed past a failing gate.

## 1. Context and decision (read this first)

The current release process (`.github/workflows/release.yml`) uses changesets:
contributors write changeset files, and the release workflow runs
`changeset version` in CI and pushes a version commit directly to `main`
(`git push origin HEAD:main`). That push is incompatible with the branch
protection we want (require PR, block force pushes, no bypass actors).

Decision: remove the need for CI to ever write to `main` by moving the
source of truth OUT of repo files:

- Version truth lives in git tags (`v*`), not `package.json`.
- Changelog truth lives in GitHub Releases, not `CHANGELOG.md`.
- Change-impact metadata is captured in Conventional Commit messages,
  produced by squash-merging PRs with conventional titles. Contributors need
  zero release knowledge; the maintainer normalizes the title at merge.
- `semantic-release` derives the version (fix = patch, feat = minor,
  feat!/BREAKING CHANGE = major), publishes to npm, creates the tag and the
  GitHub Release with generated notes. It is configured WITHOUT the
  `@semantic-release/git` plugin, so it never commits to the repo.
- Releases stay deliberate: the workflow remains `workflow_dispatch`
  (a maintainer triggers it), gated by the existing `npm-publish`
  environment with its required reviewer.
- Changesets, `.changeset/`, and `CHANGELOG.md` are removed entirely.
- Hand-editing of notes happens AFTER publish by editing the GitHub Release
  (release notes are mutable forever). `draftRelease` is deliberately NOT
  used: a draft would leave npm published with no visible notes if the
  human forgets to click Publish.

Facts verified on 2026-07-23:

- `@opensourcescouting/design-system` is NOT published on npm (404). There is
  no consumer continuity to preserve.
- The repo has ZERO git tags.
- `package.json` version is `0.2.0-alpha.0`; changesets is in pre-mode
  (`.changeset/pre.json`, tag `alpha`) with 10 pending changesets. None of
  this was ever published, so it can all be deleted.
- Remote: `https://github.com/OpenSourceScouting/design-system.git`.
- The `npm-publish` GitHub environment exists with a required reviewer and
  holds `NPM_TOKEN`.

## 2. Phase A: repo file changes (PR-able, no admin rights needed)

Do all of Phase A on a feature branch and open a PR.

### A1. Write ADR 0007

Create `docs/decisions/0007-tag-driven-releases-with-semantic-release.md`.
Read `docs/decisions/0001-record-architecture-decisions.md` and
`docs/decisions/README.md` first and match their format exactly. Content to
cover (summarize section 1 of this plan): the context (branch protection vs
CI pushing to main), the decision (tags + GitHub Releases as source of
truth, semantic-release without the git plugin, squash-merge conventional PR
titles, removal of changesets and CHANGELOG.md), the alternatives considered
(ruleset bypass via deploy key, changesets version PR, release-please), and
the consequences (repo `package.json` version is vestigial; notes are
generated, edited post-publish when needed; semver bumps derive from commit
types). Do NOT use em-dashes or en-dashes anywhere.

### A2. Remove changesets

- `git rm -r .changeset/`
- `git rm CHANGELOG.md`
- `npm uninstall @changesets/cli`
- In `package.json` `scripts`, delete: `changeset`, `version-packages`,
  `release`.

### A3. package.json publish config

- Ensure `"publishConfig": { "access": "public" }` exists in `package.json`
  (changesets carried `"access": "public"` in its own config; semantic-release
  reads npm's). Add it if missing.
- Leave the `version` field as `0.2.0-alpha.0`. It is vestigial from now on;
  semantic-release stamps the real version into the tarball at publish time.

### A4. Add semantic-release

- `npm install --save-dev semantic-release conventional-changelog-conventionalcommits`
  (the commit-analyzer, release-notes-generator, npm, and github plugins ship
  with semantic-release core; only the preset is a separate package).
- Create `.releaserc.json`:

```json
{
  "branches": [{ "name": "main", "prerelease": "alpha", "channel": "alpha" }],
  "tagFormat": "v${version}",
  "plugins": [
    ["@semantic-release/commit-analyzer", { "preset": "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { "preset": "conventionalcommits" }],
    ["@semantic-release/npm", { "tarballDir": "release-artifacts" }],
    [
      "@semantic-release/github",
      { "successComment": false, "failComment": false, "failTitle": false }
    ]
  ]
}
```

Notes for the executor:

- `prerelease: "alpha"` keeps publishing under the `alpha` dist-tag and
  `-alpha.N` versions, matching the current pre-1.0 posture. Graduating to
  stable later = remove the `prerelease`/`channel` keys; semantic-release
  will then cut the first stable release (expect `1.0.0`). Record that in
  the ADR consequences.
- `successComment`/`failComment`/`failTitle` are disabled so the workflow
  does not need `issues: write` / `pull-requests: write` permissions. If
  the installed @semantic-release/github version rejects `failTitle: false`,
  drop just that key.
- `tarballDir` keeps the packed tarball at `release-artifacts/*.tgz` so the
  workflow can SBOM/attest/upload it. The presence of that tarball after a
  run is also the signal that a release actually happened (semantic-release
  exits 0 with no release when no releasable commits exist).

### A5. Rewrite `.github/workflows/release.yml`

Keep: the `verify` job exactly as-is (full CI gate), the workflow-level
`concurrency` block, the `workflow_dispatch` trigger with the `dry-run`
input, and the `deploy-storybook` job (with a new condition, below).

Replace the `release` job with this shape (executor: preserve the existing
comment style and the npm-11 upgrade step; adapt, do not blind-paste):

```yaml
release:
  name: version, sign, publish
  needs: verify
  runs-on: ubuntu-latest
  environment: npm-publish
  permissions:
    contents: write # create the v* tag + GitHub Release
    id-token: write # Sigstore keyless signing (npm provenance + attestations)
    attestations: write
  outputs:
    released: ${{ steps.result.outputs.released }}
    version: ${{ steps.result.outputs.version }}
  steps:
    - uses: actions/checkout@v7
      with:
        fetch-depth: 0 # semantic-release walks history + tags

    - uses: actions/setup-node@v7
      with:
        node-version: 22
        cache: npm
        registry-url: https://registry.npmjs.org

    - name: Upgrade npm
      run: npm install -g npm@11

    - run: npm ci

    # Build BEFORE semantic-release: the npm plugin packs the tarball
    # during its prepare step and must see dist/.
    - name: Build library
      run: npm run build

    - name: Guard, dispatched from main only
      if: github.ref != 'refs/heads/main'
      run: |
        echo "::error::Releases must be dispatched from main (got ${GITHUB_REF})."
        exit 1

    - name: semantic-release
      run: npx semantic-release ${{ inputs.dry-run && '--dry-run' || '' }}
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        NPM_CONFIG_PROVENANCE: "true"

    - name: Detect release result
      id: result
      run: |
        TARBALL=$(ls release-artifacts/*.tgz 2>/dev/null | head -n 1 || true)
        if [ -n "$TARBALL" ]; then
          echo "released=true" >> "$GITHUB_OUTPUT"
          echo "tarball=$TARBALL" >> "$GITHUB_OUTPUT"
          echo "version=$(node -p "require('./package.json').version")" >> "$GITHUB_OUTPUT"
        else
          echo "released=false" >> "$GITHUB_OUTPUT"
          echo "No release was produced (dry run, or no releasable commits)." >> "$GITHUB_STEP_SUMMARY"
        fi

    - name: Generate SBOM (Syft, CycloneDX)
      if: steps.result.outputs.released == 'true'
      uses: anchore/sbom-action@v0
      with:
        path: .
        format: cyclonedx-json
        output-file: design-system-${{ steps.result.outputs.version }}.sbom.cdx.json
        upload-artifact: true
        upload-release-assets: false

    - name: Attest tarball and SBOM
      if: steps.result.outputs.released == 'true'
      uses: actions/attest-build-provenance@v4
      with:
        subject-path: |
          ${{ steps.result.outputs.tarball }}
          design-system-${{ steps.result.outputs.version }}.sbom.cdx.json

    - name: Upload assets to the GitHub Release
      if: steps.result.outputs.released == 'true'
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        gh release upload "v${{ steps.result.outputs.version }}" \
          "${{ steps.result.outputs.tarball }}" \
          "design-system-${{ steps.result.outputs.version }}.sbom.cdx.json"
```

`deploy-storybook`: keep the job body unchanged, but change its condition to
`if: needs.release.outputs.released == 'true'` (this also covers dry-run,
since dry-run never produces a tarball).

Delete from the old workflow: the `Consume changesets` step, the
`Read release version` / `Extract release notes` steps, the
`Push version commit` step (the whole reason for this migration), the
`Publish to npm` changeset step, `Push release tag`, and the
`gh release create` step (semantic-release's github plugin creates the
Release with generated notes; we only upload assets to it). Preserve the
top-of-file comment block but rewrite it to describe the new flow.

### A6. PR title lint workflow

Create `.github/workflows/pr-title.yml`:

```yaml
name: PR title
on:
  pull_request:
    types: [opened, edited, synchronize, reopened]
permissions:
  pull-requests: read
jobs:
  conventional-title:
    runs-on: ubuntu-latest
    steps:
      - uses: amannn/action-semantic-pull-request@v6
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Default type list matches Conventional Commits; no extra config needed.
This becomes a required check in Phase B so titles are guaranteed before
squash-merge.

### A7. Documentation updates

- `.github/CONTRIBUTING.md` lines ~171-190: replace the whole changesets
  section. New content: contributors do NOT manage versions or changelogs;
  PRs are squash-merged and the PR title becomes a Conventional Commit
  (`feat(button): ...`, `fix: ...`, `feat!:` for breaking); a CI check
  validates the title and maintainers may adjust it at merge; versioning and
  release notes are derived automatically (semantic-release) and published
  as GitHub Releases; releases are cut by maintainers via the Release
  workflow.
- `README.md` line ~705: change "noted in the `CHANGELOG.md`" to "noted in
  the GitHub Release notes".
- `README.md` line ~746: change "(setup, conventions, and the changeset
  requirement)" to "(setup, conventions, and PR title format)".
- Add a short "Releases" note in README (near the Scripts section): versions
  and notes live in GitHub Releases
  (`https://github.com/OpenSourceScouting/design-system/releases`); the
  repo's `package.json` version is not meaningful between releases.
- Do NOT edit `docs/shadcn-migration-plan.md` (historical document).
- `CLAUDE.md` has no changeset references; no edit needed there.

### A8. Phase A verification gate

- `npm ci && npm run lint && npm run typecheck && npm run build` all pass.
- `npx semantic-release --dry-run` run locally will fail on auth/branch
  checks; that is expected. Instead sanity-check config with
  `npx semantic-release --dry-run --no-ci` only if a `GITHUB_TOKEN` env var
  is available; otherwise defer to the Phase C dry-run.
- `grep -ri changeset --include='*.md' --include='*.yml' --include='*.json' .`
  (excluding `node_modules`, `package-lock.json`, and this plan/the ADR)
  returns nothing.
- Open the PR, get it merged through the normal gate.

## 3. Phase B: repository settings (admin, run with maintainer approval)

These mutate GitHub settings. Show each command to the maintainer before
running. Repo: `OpenSourceScouting/design-system`.

### B1. Squash-only merges, PR title as commit subject

```bash
gh api -X PATCH repos/OpenSourceScouting/design-system \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false \
  -f squash_merge_commit_title=PR_TITLE \
  -f squash_merge_commit_message=PR_BODY
```

### B2. Branch ruleset on main

Create a ruleset (no bypass actors at all; nothing needs to push to main):

```bash
gh api -X POST repos/OpenSourceScouting/design-system/rulesets --input - <<'JSON'
{
  "name": "protect-main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["squash"]
      } },
    { "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": []
      } }
  ]
}
JSON
```

Before running: read `.github/workflows/ci.yml` and fill
`required_status_checks` with its job check names (each entry is
`{ "context": "<check name>" }`), plus `"conventional-title"` from A6.
Set `required_approving_review_count` per maintainer preference (0 keeps
solo-maintainer merges possible; confirm with the maintainer).

### B3. Tag ruleset for v* (only maintainers/CI create release tags)

```bash
gh api -X POST repos/OpenSourceScouting/design-system/rulesets --input - <<'JSON'
{
  "name": "protect-release-tags",
  "target": "tag",
  "enforcement": "active",
  "bypass_actors": [
    { "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" }
  ],
  "conditions": { "ref_name": { "include": ["refs/tags/v*"], "exclude": [] } },
  "rules": [ { "type": "creation" }, { "type": "update" }, { "type": "deletion" } ]
}
JSON
```

`actor_id: 5` is the Repository admin role; add `{ "actor_id": 2, ... }`
(maintain role) if non-admin maintainers should tag. The release workflow
creates tags with `GITHUB_TOKEN`; if tag creation from the workflow is
blocked by this ruleset during the Phase C test, add the GitHub Actions
integration as a bypass actor on THIS TAG RULESET ONLY (never on the branch
ruleset).

### B4. Environment check

Verify in Settings > Environments > npm-publish: required reviewer present,
`NPM_TOKEN` secret present, deployment branch policy includes `main`
(the workflow remains dispatch-from-main, so branch policy still works; no
tag policy needed because the trigger is not a tag event).

## 4. Phase C: baseline tag and first release

### C1. Baseline tag (maintainer, local)

semantic-release derives the next version from the last `v*` tag. Create the
baseline on current main HEAD, matching `package.json`:

```bash
git checkout main && git pull
git tag v0.2.0-alpha.0
git push origin v0.2.0-alpha.0
```

Consequence (accepted): the first semantic-release release only includes
commits merged AFTER this tag. The pre-migration alpha work was never
published, so no notes are lost to any consumer. Optionally hand-edit the
first GitHub Release afterwards to summarize the accumulated alpha features.

### C2. Dry run

Merge at least one releasable commit (a `fix:` or `feat:` squash merge), then
dispatch the Release workflow from main with `dry-run: true`. Approve the
environment gate. Verify in the logs:

- semantic-release resolves the last release as `v0.2.0-alpha.0`.
- The computed next version is an `-alpha.N` prerelease on the `alpha`
  channel (exact number depends on commit types; `0.2.0-alpha.1` for a fix).
  If the computed version looks wrong (e.g. jumps to `1.0.0-alpha.1`), a
  `feat!`/BREAKING commit landed; that is correct semver behavior, not a
  bug. Confirm with the maintainer before the real run.
- Nothing was pushed, tagged, published, or released.

### C3. Real release

Dispatch with `dry-run: false`, approve the gate, then verify ALL of:

- npm: `npm view @opensourcescouting/design-system dist-tags` shows the new
  version under `alpha`, and `npm view ... --json | jq .dist.attestations`
  shows provenance.
- GitHub: the `v*` tag exists; the Release exists, is marked pre-release,
  has generated notes, and has the tarball + SBOM attached.
- The Pages Storybook deploy ran (deploy-storybook job).
- `main` received no new commits from the workflow.

### C4. Follow-up: npm trusted publishing (after first publish)

Once the package exists on npm, configure a trusted publisher on
npmjs.com (package settings > Trusted publisher: GitHub Actions,
repo `OpenSourceScouting/design-system`, workflow `release.yml`,
environment `npm-publish`). Then remove `NODE_AUTH_TOKEN` from the
workflow step and delete the `NPM_TOKEN` secret. Requires npm CLI >= 11.5
in the workflow (the npm-11 upgrade step already installs latest 11.x).
Verify with one more release. This removes the long-lived token entirely.

## 5. Out of scope / do not do

- Do not add `@semantic-release/git` or `@semantic-release/changelog`
  (they reintroduce CI writes to main, the problem this migration removes).
- Do not add any bypass actors to the BRANCH ruleset.
- Do not use `draftRelease` in the github plugin config.
- Do not delete or rewrite git history, and do not touch `public/marks/`
  or anything in the brand-asset model.
- Do not use em-dashes or en-dashes in any file written during execution.
