import type { TestRunnerConfig } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

/**
 * Visual regression via @storybook/test-runner.
 *
 * Why jest-image-snapshot (not Playwright's toHaveScreenshot):
 * The test-runner drives stories through Jest (jest-playwright), not the
 * Playwright test runner. `expect(page).toHaveScreenshot()` from
 * `@playwright/test` is only wired up inside `@playwright/test`'s own runner,
 * so it is unavailable here. `jest-image-snapshot` plugs into the Jest
 * `expect` the test-runner already uses, which is the idiomatic v8 approach.
 *
 * Determinism: baselines MUST be produced in the same environment CI uses
 * (mcr.microsoft.com/playwright:v<version>-jammy). Font rendering and
 * antialiasing differ across OSes, so machine-local baselines cause false
 * diffs. See .storybook/VISUAL_REGRESSION.md.
 */

// Widths we snapshot each story at. Height is generous; the page is clamped
// so the full story fits and we screenshot the viewport.
const VIEWPORTS = [
  { label: "375", width: 375, height: 900 },
  { label: "768", width: 768, height: 1000 },
  { label: "1280", width: 1280, height: 1024 },
];

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },

  async postVisit(page, context) {
    // Wait for fonts to load so glyph metrics are stable, then wait for the
    // network to go idle (any lazily loaded images/assets settle).
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState("networkidle");

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      // Re-assert fonts after the resize reflow before capturing.
      await page.evaluate(() => document.fonts.ready);

      const image = await page.screenshot({ animations: "disabled" });

      expect(image).toMatchImageSnapshot({
        // One committed baseline dir, one file per story x viewport.
        customSnapshotsDir: `${process.cwd()}/.storybook/__image_snapshots__`,
        customDiffDir: `${process.cwd()}/.storybook/__image_snapshots__/__diffs__`,
        customSnapshotIdentifier: `${context.id}-${vp.label}`,
        // Small tolerance absorbs sub-pixel noise while still catching real
        // regressions. Kept tight because the environment is pinned.
        failureThreshold: 0.02,
        failureThresholdType: "percent",
      });
    }
  },
};

export default config;
