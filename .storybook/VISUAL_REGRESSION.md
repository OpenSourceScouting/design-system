# Visual regression (self-hosted Playwright)

We replaced Chromatic with self-hosted visual regression to avoid SaaS
snapshot limits and vendor lock-in. It runs `@storybook/test-runner` under
Jest, screenshots every story at three viewport widths (375 / 768 / 1280) in a
`postVisit` hook, and diffs each capture against a committed PNG baseline using
`jest-image-snapshot`.

- Config: `.storybook/test-runner.ts`
- Baselines: `.storybook/__image_snapshots__/` (committed, one PNG per story x width)
- Diffs on failure: `.storybook/__image_snapshots__/__diffs__/` (gitignored)
- CI: `.github/workflows/visual.yml`

## Determinism (read this before regenerating)

Font hinting and antialiasing differ across operating systems, so a baseline
generated on macOS will false-diff against a Linux CI run. Baselines are
therefore ALWAYS generated inside the pinned Playwright container, which is the
exact environment CI uses:

    mcr.microsoft.com/playwright:v1.61.1-jammy

The tag must match the `playwright` version in `package-lock.json`. If you
upgrade Playwright, update the tag here and in `visual.yml`, then regenerate.

## Run the checks locally

    npm run build-storybook
    npm run test:visual:ci

`test:visual:ci` serves `storybook-static` on port 6006 with `http-server`,
waits for it, then runs the test-runner against it. If you already have
Storybook running, `npm run test:visual` targets `http://127.0.0.1:6006`
directly.

## Regenerate baselines (the only supported way)

Run the identical container against your working tree and commit the PNGs it
writes:

    docker run --rm -it \
      -v "$PWD":/work -w /work \
      mcr.microsoft.com/playwright:v1.61.1-jammy \
      bash -lc "npm ci && npm run build-storybook && npm run test:visual:update"

Then review and commit the changed files under
`.storybook/__image_snapshots__/`. `test:visual:update` passes `-u` to the
test-runner, which writes/overwrites baselines instead of diffing.

Alternatively, trigger the `Visual regression` workflow manually
(workflow_dispatch) with `update_baselines=true`; it uploads the regenerated
PNGs as an artifact for you to download and commit. It does not auto-push.
