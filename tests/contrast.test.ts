import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Contrast regression guard.
 *
 * Parses src/styles/tokens.css directly (no runtime, no browser) and asserts
 * the documented WCAG contrast thresholds hold for every palette: the :root
 * default plus each [data-program] block. A single token edit that drops a
 * pair below its threshold fails here before it can ship.
 *
 * The math is plain TS so the test carries no dependency: sRGB -> linearized
 * channels -> relative luminance -> contrast ratio, per WCAG 2.x definitions.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_CSS = readFileSync(path.resolve(__dirname, "../src/styles/tokens.css"), "utf8");

type RGB = [number, number, number];

/** Linearize one 0-255 sRGB channel per the WCAG formula. */
function linearize(channel8: number): number {
  const c = channel8 / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of an sRGB triplet. */
function luminance([r, g, b]: RGB): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG contrast ratio between two colors (>= 1, symmetric). */
function contrastRatio(a: RGB, b: RGB): number {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Extract a single palette (map of token name -> RGB triplet) from a CSS
 * selector block. `selector` is matched literally against the text before the
 * `{`. Only `--program-*` declarations holding three space-separated integers
 * are captured; typography/radius/shadow tokens are ignored.
 */
function parsePalette(css: string, selector: string): Record<string, RGB> {
  // Find the block that starts with the given selector at the start of a line.
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockRe = new RegExp(`(^|\\n)\\s*${escaped}\\s*\\{([\\s\\S]*?)\\}`, "m");
  const match = css.match(blockRe);
  if (!match) {
    throw new Error(`Could not find CSS block for selector: ${selector}`);
  }
  const body = match[2];
  const palette: Record<string, RGB> = {};
  // Capture ALL custom-property triplets: both the legacy --program-* tokens and
  // the shadcn / --os-* vocabulary added in the Phase 1 re-platform.
  const declRe = /(--[\w-]+)\s*:\s*(\d+)\s+(\d+)\s+(\d+)\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = declRe.exec(body)) !== null) {
    palette[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])];
  }
  return palette;
}

const PALETTES: { name: string; selector: string }[] = [
  { name: "root (Scouting America)", selector: ":root" },
  { name: "cub", selector: '[data-program="cub"]' },
  { name: "scoutsbsa", selector: '[data-program="scoutsbsa"]' },
  { name: "venturing", selector: '[data-program="venturing"]' },
  { name: "seascouts", selector: '[data-program="seascouts"]' },
];

describe("tokens.css contrast ratios", () => {
  for (const { name, selector } of PALETTES) {
    describe(name, () => {
      const p = parsePalette(TOKENS_CSS, selector);

      const ratio = (fg: string, bg: string): number => {
        const f = p[fg];
        const b = p[bg];
        expect(f, `${fg} missing in ${name}`).toBeDefined();
        expect(b, `${bg} missing in ${name}`).toBeDefined();
        return contrastRatio(f, b);
      };

      it("on-surface vs surface >= 4.5 (AA body text)", () => {
        expect(ratio("--program-on-surface", "--program-surface")).toBeGreaterThanOrEqual(4.5);
      });

      it("on-surface-soft vs surface >= 4.5 (AA muted body text)", () => {
        expect(ratio("--program-on-surface-soft", "--program-surface")).toBeGreaterThanOrEqual(4.5);
      });

      it("on-surface-faint vs surface >= 3.0 (inactive/dim text)", () => {
        // The original seascouts value (#7E8FA8 on #F0F4F8) measured 2.98:1;
        // the token was darkened to #7687A0 (3.31:1) when this test caught it.
        expect(ratio("--program-on-surface-faint", "--program-surface")).toBeGreaterThanOrEqual(
          3.0,
        );
      });

      it("on-primary vs primary >= 4.5 (AA text on primary surfaces)", () => {
        expect(ratio("--program-on-primary", "--program-primary")).toBeGreaterThanOrEqual(4.5);
      });

      it("on-primary-soft vs primary >= 4.5 (AA muted text on primary)", () => {
        expect(ratio("--program-on-primary-soft", "--program-primary")).toBeGreaterThanOrEqual(4.5);
      });

      it("on-accent vs accent >= 3.0 (large-text only)", () => {
        // Threshold is 3.0, not 4.5, on purpose. The accent fill is gold/yellow
        // in every program and its dark on-accent text only reaches AA (4.5:1)
        // at large sizes (16px bold / 24px normal and up). The Button type
        // system already forbids the small-size accent combination (task 1.4),
        // so we assert the large-text AA floor (WCAG SC 1.4.3, 3:1) here rather
        // than a normal-text 4.5:1 the palette is not designed to meet.
        expect(ratio("--program-on-accent", "--program-accent")).toBeGreaterThanOrEqual(3.0);
      });

      // --- shadcn / --os-* vocabulary (Phase 1 re-platform) -----------------
      // Same audited values under the new names; assert the thresholds hold so
      // the migration cannot silently regress contrast before components port.
      describe("shadcn vocabulary", () => {
        it("foreground vs background >= 4.5 (AA body text)", () => {
          expect(ratio("--foreground", "--background")).toBeGreaterThanOrEqual(4.5);
        });

        it("card-foreground vs card >= 4.5", () => {
          expect(ratio("--card-foreground", "--card")).toBeGreaterThanOrEqual(4.5);
        });

        it("popover-foreground vs popover >= 4.5", () => {
          expect(ratio("--popover-foreground", "--popover")).toBeGreaterThanOrEqual(4.5);
        });

        it("primary-foreground vs primary >= 4.5 (AA text on primary)", () => {
          expect(ratio("--primary-foreground", "--primary")).toBeGreaterThanOrEqual(4.5);
        });

        it("secondary-foreground vs secondary >= 4.5", () => {
          expect(ratio("--secondary-foreground", "--secondary")).toBeGreaterThanOrEqual(4.5);
        });

        it("muted-foreground vs background >= 4.5 (AA muted body text)", () => {
          expect(ratio("--muted-foreground", "--background")).toBeGreaterThanOrEqual(4.5);
        });

        it("accent-foreground vs accent >= 4.5 (AA text on the hover wash)", () => {
          // Delta 4: --accent is the muted wash, so it must carry AA text like
          // any surface, unlike the saturated brand fill below.
          expect(ratio("--accent-foreground", "--accent")).toBeGreaterThanOrEqual(4.5);
        });

        it("destructive-foreground vs destructive >= 4.5", () => {
          expect(ratio("--destructive-foreground", "--destructive")).toBeGreaterThanOrEqual(4.5);
        });

        it("os-on-primary-soft vs primary >= 4.5 (AA muted text on primary)", () => {
          expect(ratio("--os-on-primary-soft", "--primary")).toBeGreaterThanOrEqual(4.5);
        });

        it("os-on-surface-faint vs background >= 3.0 (inactive/dim text)", () => {
          expect(ratio("--os-on-surface-faint", "--background")).toBeGreaterThanOrEqual(3.0);
        });

        it("os-accent-foreground vs os-accent >= 3.0 (brand accent, large-text)", () => {
          // Brand gold/yellow only reaches AA at large sizes, same rationale as
          // the legacy on-accent/accent assertion above.
          expect(ratio("--os-accent-foreground", "--os-accent")).toBeGreaterThanOrEqual(3.0);
        });
      });
    });
  }
});
