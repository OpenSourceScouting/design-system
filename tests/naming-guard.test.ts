import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Naming guard (see "Naming rule" in CLAUDE.md).
 *
 * 1. The organization's name is never abbreviated as "SA" / "sa": the
 *    abbreviation has very bad connotations. The fixed palette is `scout-*`.
 * 2. "Scouting America" is a registered trademark, so it is never a product or
 *    naming term. It may appear only where it identifies the organization
 *    (disclaimer, guideline citations, ownership/licensing statements, link
 *    labels, the wordmark's alt text), matched by ATTRIBUTION below.
 *
 * Every tracked text file is scanned, so a new doc or component cannot slip
 * past the rule the way the original `sa-*` palette did.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const BINARY = /\.(png|jpe?g|gif|webp|ico|pdf|woff2?|ttf|otf)$/i;
const SKIP = new Set(["package-lock.json", "tests/naming-guard.test.ts"]);

const files = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter((f) => f && !BINARY.test(f) && !SKIP.has(f) && !f.startsWith("research/"));

// Files that exist to identify the organization (legal notice, external links).
const ATTRIBUTION_FILES = new Set(["NOTICE.md", "LICENSE", "src/lib/links.ts"]);

// Phrases that name the organization to identify it, not to brand anything.
// `\s+` lets a phrase wrap across lines in prose.
const ORG = String.raw`Scouting\s+America`;
const ATTRIBUTION = [
  new RegExp(String.raw`${ORG}\s+2024\s+Brand\s+Guidelines`, "g"),
  /Scouting-America-Brand-Guidelines-2024/g, // the guidelines PDF URL
  /scouting-america-brand-guidelines-2024\.pdf/g, // the local (gitignored) copy
  new RegExp(String.raw`(affiliated|endorsed|sponsored)\s+(with|by)[^.]*?${ORG}`, "g"),
  new RegExp(String.raw`official\s+${ORG}\s+(product|property)`, "g"),
  new RegExp(String.raw`${ORG}(\s+trademarks|'s\s+copyrighted|\s+National\s+Council)`, "g"),
  new RegExp(String.raw`alt="${ORG}"`, "g"),
];

const lineOf = (text: string, index: number) => text.slice(0, index).split("\n").length;

describe("naming guard", () => {
  it("scans the tracked text files", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('never abbreviates the organization as "SA" / "sa"', () => {
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(path.join(root, file), "utf8");
      // A standalone sa/SA token: covers `sa-blue`, `$sa-tokens`, `SA_PALETTE`,
      // "SA Blue", and `sa.*`, but not words that merely contain the letters.
      for (const m of text.matchAll(/(?<![A-Za-z0-9])sa(?![A-Za-z0-9])/gi)) {
        hits.push(`${file}:${lineOf(text, m.index)}: ${m[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('uses "Scouting America" only to identify the organization', () => {
    const hits: string[] = [];
    for (const file of files) {
      if (ATTRIBUTION_FILES.has(file)) continue;
      let text = readFileSync(path.join(root, file), "utf8");
      // Blank out allowed phrases (same length, so line numbers stay true).
      for (const re of ATTRIBUTION) text = text.replace(re, (s) => s.replace(/[^\n]/g, " "));
      for (const m of text.matchAll(/scouting[\s_-]*america/gi)) {
        hits.push(`${file}:${lineOf(text, m.index)}: ${m[0].replace(/\s+/g, " ")}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
