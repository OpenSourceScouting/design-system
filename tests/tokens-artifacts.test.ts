import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { TOKENS } from "@/lib/tokens";

/**
 * Guards the generated token data (src/lib/tokens/tokens.generated.ts, which
 * backs the `TOKENS` export and the dist file artifacts) against drift from the
 * authored source of truth, src/styles/tokens.css. This test re-parses the CSS
 * INDEPENDENTLY of scripts/tokens-data.mjs, so it also cross-checks the parser:
 * if the committed data is stale (someone edited tokens.css without running
 * `npm run build:tokens`), this fails.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSS = readFileSync(path.resolve(__dirname, "../src/styles/tokens.css"), "utf8");

const SELECTORS = {
  root: ":root",
  cub: '[data-program="cub"]',
  scoutsbsa: '[data-program="scoutsbsa"]',
  venturing: '[data-program="venturing"]',
  seascouts: '[data-program="seascouts"]',
} as const;

/** Independently extract the color triplets (name -> [r,g,b]) from one block. */
function parseColors(selector: string): Record<string, [number, number, number]> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const body = CSS.match(new RegExp(`(^|\\n)\\s*${escaped}\\s*\\{([\\s\\S]*?)\\}`, "m"))?.[2];
  if (!body) throw new Error(`tokens.css: no block for ${selector}`);
  const colors: Record<string, [number, number, number]> = {};
  const declRe = /(--[\w-]+)\s*:\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = declRe.exec(body)) !== null) {
    colors[m[1].slice(2)] = [Number(m[2]), Number(m[3]), Number(m[4])];
  }
  return colors;
}

function toHex([r, g, b]: number[]): string {
  return (
    "#" +
    [r, g, b]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

describe("token data artifacts", () => {
  it("exposes the five palettes", () => {
    expect(Object.keys(TOKENS).sort()).toEqual([
      "cub",
      "root",
      "scoutsbsa",
      "seascouts",
      "venturing",
    ]);
  });

  for (const [key, selector] of Object.entries(SELECTORS)) {
    it(`${key}: committed color data matches tokens.css (not stale)`, () => {
      const cssColors = parseColors(selector);
      const committed = TOKENS[key as keyof typeof TOKENS].colors as Record<
        string,
        { rgb: readonly number[]; hex: string }
      >;

      expect(Object.keys(committed).sort()).toEqual(Object.keys(cssColors).sort());
      for (const [name, rgb] of Object.entries(cssColors)) {
        expect(committed[name].rgb).toEqual(rgb);
        expect(committed[name].hex).toBe(toHex(rgb));
      }
    });
  }

  it("the four programs share an identical color-token set", () => {
    const keysOf = (p: "cub" | "scoutsbsa" | "venturing" | "seascouts") =>
      Object.keys(TOKENS[p].colors).sort();
    const base = keysOf("cub");
    for (const p of ["scoutsbsa", "venturing", "seascouts"] as const) {
      expect(keysOf(p)).toEqual(base);
    }
  });
});
