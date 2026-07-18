import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Token mapping guard (transitional; removed with the legacy tokens in Phase 5).
 *
 * During the shadcn re-platform two token vocabularies coexist in tokens.css:
 * the legacy --program-* names (still consumed by 62 files via the v3 preset)
 * and the new shadcn / --os-* names (the future source of truth). Their values
 * are duplicated literals, so they can DRIFT. This test pins the curated mapping
 * as executable documentation:
 *
 *   - 1:1 semantic mappings (primary, surface->background, ...) must be equal.
 *   - Delta 4 (ADR 0002): shadcn --accent is the muted hover wash (= surface-
 *     muted), and must NOT equal the brand accent, which lives in --os-accent
 *     (= the legacy --program-accent). This is the whole point of the curated
 *     mapping: a naive name-match would paint hover states brand-gold.
 *   - The system-feedback invariant: --destructive is sa-red in every program.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_CSS = readFileSync(path.resolve(__dirname, "../src/styles/tokens.css"), "utf8");

/** Parse a block into name -> raw value string (works for colors and scalars). */
function parseValues(css: string, selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockRe = new RegExp(`(^|\\n)\\s*${escaped}\\s*\\{([\\s\\S]*?)\\}`, "m");
  const match = css.match(blockRe);
  if (!match) throw new Error(`Could not find CSS block for selector: ${selector}`);
  const values: Record<string, string> = {};
  for (const m of match[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    values[m[1]] = m[2].trim();
  }
  return values;
}

const PALETTES: { name: string; selector: string }[] = [
  { name: "root (parent brand)", selector: ":root" },
  { name: "cub", selector: '[data-program="cub"]' },
  { name: "scoutsbsa", selector: '[data-program="scoutsbsa"]' },
  { name: "venturing", selector: '[data-program="venturing"]' },
  { name: "seascouts", selector: '[data-program="seascouts"]' },
];

/** new shadcn / --os-* name -> legacy --program-* name that must hold the same value. */
const ONE_TO_ONE: [string, string][] = [
  ["--background", "--program-surface"],
  ["--foreground", "--program-on-surface"],
  ["--card", "--program-surface"],
  ["--card-foreground", "--program-on-surface"],
  ["--popover", "--program-surface"],
  ["--popover-foreground", "--program-on-surface"],
  ["--primary", "--program-primary"],
  ["--primary-foreground", "--program-on-primary"],
  ["--secondary", "--program-surface-muted"],
  ["--secondary-foreground", "--program-on-surface-muted"],
  ["--muted", "--program-surface-muted"],
  ["--muted-foreground", "--program-on-surface-soft"],
  ["--accent", "--program-surface-muted"], // delta 4: wash, not brand accent
  ["--accent-foreground", "--program-on-surface-muted"],
  ["--border", "--program-border"],
  ["--input", "--program-border"],
  ["--ring", "--program-ring"],
  ["--radius", "--program-radius"],
  ["--os-accent", "--program-accent"], // brand accent lives here
  ["--os-accent-foreground", "--program-on-accent"],
  ["--os-on-primary-soft", "--program-on-primary-soft"],
  ["--os-on-surface-faint", "--program-on-surface-faint"],
  ["--os-decor", "--program-decor"],
  ["--os-rule-weight", "--program-rule-weight"],
  ["--os-shadow", "--program-shadow"],
  ["--os-display-weight", "--program-display-weight"],
  ["--os-display-tracking", "--program-display-tracking"],
  ["--os-display-style", "--program-display-style"],
  ["--os-display-transform", "--program-display-transform"],
];

describe("tokens.css shadcn <-> legacy mapping", () => {
  for (const { name, selector } of PALETTES) {
    describe(name, () => {
      const v = parseValues(TOKENS_CSS, selector);

      it("1:1 semantic mappings match their legacy source", () => {
        for (const [next, legacy] of ONE_TO_ONE) {
          expect(v[next], `${next} missing in ${name}`).toBeDefined();
          expect(v[legacy], `${legacy} missing in ${name}`).toBeDefined();
          expect(v[next], `${next} must equal ${legacy} in ${name}`).toBe(v[legacy]);
        }
      });

      it("delta 4: --accent (wash) is NOT the brand accent (--os-accent)", () => {
        expect(v["--accent"]).not.toBe(v["--os-accent"]);
      });

      it("--destructive is sa-red (system feedback, identical across programs)", () => {
        expect(v["--destructive"]).toBe("206 17 38");
        expect(v["--destructive-foreground"]).toBe("255 255 255");
      });
    });
  }

  it(":root shares the one typography pair under both names", () => {
    const v = parseValues(TOKENS_CSS, ":root");
    expect(v["--os-font-display"]).toBe(v["--program-font-display"]);
    expect(v["--os-font-body"]).toBe(v["--program-font-body"]);
  });
});
