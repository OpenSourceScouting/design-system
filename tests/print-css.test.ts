import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Document / print stylesheet guard.
 *
 * print.css is plain CSS shipped to tools that render Markdown to HTML/PDF, so
 * nothing type-checks it and no Tailwind build validates it. Its two failure
 * modes are silent:
 *   1. It reads a token variable that does not exist (a typo, or a token later
 *      renamed in tokens.css), and the property quietly falls back to inherit.
 *   2. A rule escapes the `.os-document` scope, and importing the file restyles
 *      the host app's bare h1/p/table elements.
 * It also has to actually ship: the build must copy it and the exports map must
 * expose it (and tokens.print.json, which a PDF generator needs too).
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Split a selector list on top-level commas only (not inside `:is(a, b)`). */
const splitSelectorList = (list: string) => {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of list) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  return [...parts, current];
};

const printCss = stripComments(read("src/styles/print.css"));
const tokensCss = stripComments(read("src/styles/tokens.css"));

describe("print.css", () => {
  it("only reads variables defined in tokens.css or declared in print.css itself", () => {
    const defined = new Set(
      [
        ...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g),
        ...printCss.matchAll(/(--[a-z0-9-]+)\s*:/g),
      ].map((m) => m[1]),
    );
    const used = new Set([...printCss.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
    const missing = [...used].filter((v) => !defined.has(v));
    expect(missing).toEqual([]);
  });

  it("scopes every style rule under .os-document (only @page is global)", () => {
    // Walk the rule preludes (the text before each `{`), skipping at-rules.
    // Nested blocks inside @media are visited the same way, so their selectors
    // are checked too.
    const preludes = [...printCss.matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim());
    const selectors = preludes
      .filter((p) => !p.startsWith("@"))
      .flatMap((p) => splitSelectorList(p).map((s) => s.trim()))
      .filter(Boolean);
    expect(selectors.length).toBeGreaterThan(20);
    const leaking = selectors.filter((s) => !s.startsWith(".os-document"));
    expect(leaking).toEqual([]);
    const globalAtRules = preludes.filter((p) => p.startsWith("@") && !/^@(page|media)\b/.test(p));
    expect(globalAtRules).toEqual([]);
  });

  it("is copied by the build and exposed in the exports map", () => {
    const buildCss = read("scripts/build-css.mjs");
    expect(buildCss).toContain('path.join(root, "src", "styles", "print.css")');
    expect(buildCss).toContain('"print.css.d.ts"');

    const pkg = JSON.parse(read("package.json"));
    expect(pkg.exports["./print.css"]).toEqual({
      types: "./dist/print.css.d.ts",
      default: "./dist/print.css",
    });
    expect(pkg.exports["./tokens.print.json"]).toBe("./dist/tokens.print.json");
  });

  it("stays out of the published Tailwind stylesheet (its @page is global)", () => {
    expect(read("src/styles/library.css")).not.toContain("print.css");
  });
});
