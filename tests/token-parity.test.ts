import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Token parity guard.
 *
 * The theming model defines the SAME semantic token names once per program
 * ([data-program="..."] blocks) plus the :root default. The maintenance risk is
 * DRIFT: add a themeable token to :root (or to one program) and forget the
 * others, and that program silently falls back to the parent value with no
 * error. This test converts that silent bug into a failing assertion, so adding
 * a program (or a token) stays a safe, purely-additive change.
 *
 * Invariants enforced:
 *   1. Every [data-program] block defines an IDENTICAL set of tokens. Adding a
 *      token to one program but not the others fails here.
 *   2. Every token a program defines also exists in :root (a program cannot
 *      theme a token the parent never establishes a default for).
 *   3. Tokens that live ONLY in :root (never themed per program) must be exactly
 *      the documented shared allowlist below. A NEW un-shared :root-only token
 *      fails, forcing an intentional decision: theme it everywhere, or add it to
 *      the allowlist WITH a reason.
 *
 * Future-proofing for dark mode (TODO 3.1): when [data-program].dark blocks are
 * added, extend PROGRAM_SELECTORS with the mode dimension and reuse invariant 1
 * so every program gets a complete dark palette or none.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_CSS = readFileSync(path.resolve(__dirname, "../src/styles/tokens.css"), "utf8");

/**
 * Tokens intentionally defined ONLY on :root and shared unchanged by every
 * program. Each entry needs a reason, because the default posture is "themeable
 * per program"; landing here is the exception.
 */
const ROOT_ONLY_SHARED = new Set<string>([
  // One typography pair across all programs (Montserrat display, Source Serif 4
  // body). Per-program differentiation is weight/tracking/style, not family, so
  // the family tokens are shared and never re-declared per program.
  "--os-font-display",
  "--os-font-body",
]);

const ROOT_SELECTOR = ":root";
const PROGRAM_SELECTORS = [
  '[data-program="cub"]',
  '[data-program="scoutsbsa"]',
  '[data-program="venturing"]',
  '[data-program="seascouts"]',
];

/**
 * Collect the set of custom-property NAMES declared in a block. Guards BOTH
 * vocabularies during the migration: legacy --program-* and the shadcn / --os-*
 * names. A `--x:` at the start of a declaration is matched; `var(--x)` inside a
 * value is not (no trailing colon), so values never produce false names.
 */
function tokenNames(css: string, selector: string): Set<string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockRe = new RegExp(`(^|\\n)\\s*${escaped}\\s*\\{([\\s\\S]*?)\\}`, "m");
  const match = css.match(blockRe);
  if (!match) throw new Error(`Could not find CSS block for selector: ${selector}`);
  return new Set([...match[2].matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
}

const rootTokens = tokenNames(TOKENS_CSS, ROOT_SELECTOR);
const programTokens = new Map(PROGRAM_SELECTORS.map((s) => [s, tokenNames(TOKENS_CSS, s)]));

const sorted = (s: Iterable<string>) => [...s].sort();
const diff = (a: Set<string>, b: Set<string>) => sorted([...a].filter((x) => !b.has(x)));

describe("tokens.css token parity", () => {
  it("every program block defines an identical token set", () => {
    const [first, ...rest] = PROGRAM_SELECTORS;
    const reference = programTokens.get(first)!;
    for (const selector of rest) {
      const current = programTokens.get(selector)!;
      expect(
        diff(reference, current),
        `${selector} is MISSING tokens that ${first} defines`,
      ).toEqual([]);
      expect(
        diff(current, reference),
        `${selector} defines EXTRA tokens ${first} does not`,
      ).toEqual([]);
    }
  });

  it("every program token has a :root default", () => {
    for (const [selector, tokens] of programTokens) {
      expect(diff(tokens, rootTokens), `${selector} themes tokens absent from :root`).toEqual([]);
    }
  });

  it("tokens defined only on :root match the documented shared allowlist", () => {
    const definedByAnyProgram = new Set<string>();
    for (const tokens of programTokens.values()) {
      for (const t of tokens) definedByAnyProgram.add(t);
    }
    const rootOnly = new Set([...rootTokens].filter((t) => !definedByAnyProgram.has(t)));
    // Anything root-only that is NOT allowlisted is likely forgotten drift.
    expect(
      sorted([...rootOnly].filter((t) => !ROOT_ONLY_SHARED.has(t))),
      "un-shared token defined only on :root (theme it per program, or allowlist it with a reason)",
    ).toEqual([]);
    // Allowlist entries that are no longer root-only are stale: remove them.
    expect(
      sorted([...ROOT_ONLY_SHARED].filter((t) => !rootOnly.has(t))),
      "stale ROOT_ONLY_SHARED entry: this token is now themed per program or gone",
    ).toEqual([]);
  });
});
