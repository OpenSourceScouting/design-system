/**
 * CSS build step for the published package.
 *
 * Vite's library mode cannot take a CSS file as a rollup input (and would inline
 * a component-scoped chunk rather than the fully Tailwind-processed stylesheet we
 * want), so the two CSS exports are produced here instead:
 *
 *   dist/styles.css: globals.css run through Tailwind (base/components/utilities
 *                      plus the @import of tokens.css). This is the "batteries
 *                      included" import: "@openscouting/design-system/styles".
 *   dist/tokens.css: tokens.css verbatim (the :root + [data-program] custom
 *                      properties and the plain `.display` rule) for consumers who
 *                      run their own Tailwind build via the shared preset and only
 *                      need the design-token variables.
 *
 * It also emits a tiny ambient declaration next to each CSS artifact. Under
 * TypeScript's "bundler" moduleResolution a bare side-effect import of a .css
 * subpath export needs a matching "types" condition or tsc raises TS2882
 * ("Cannot find module ... or its corresponding type declarations"). The
 * `exports` map points each CSS subpath's "types" condition at these stubs.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
mkdirSync(dist, { recursive: true });

// 1. Tailwind-process globals.css into dist/styles.css.
const tailwindBin = path.join(root, "node_modules", ".bin", "tailwindcss");
execFileSync(
  tailwindBin,
  [
    "-i",
    path.join(root, "src", "styles", "globals.css"),
    "-o",
    path.join(dist, "styles.css"),
    "--minify",
  ],
  { stdio: "inherit" },
);

// 2. Ship tokens.css verbatim.
copyFileSync(path.join(root, "src", "styles", "tokens.css"), path.join(dist, "tokens.css"));

// 2b. Ship print token data (CMYK / Pantone equivalents) verbatim.
copyFileSync(
  path.join(root, "src", "styles", "tokens.print.json"),
  path.join(dist, "tokens.print.json"),
);

// 3. Emit ambient declaration stubs so TS "bundler" resolution accepts the
//    side-effect CSS imports (fixes TS2882).
const cssStub = "// Ambient stub for a side-effect CSS import. No runtime value.\nexport {};\n";
writeFileSync(path.join(dist, "styles.css.d.ts"), cssStub);
writeFileSync(path.join(dist, "tokens.css.d.ts"), cssStub);

console.log("build-css: wrote dist/styles.css, dist/tokens.css, dist/tokens.print.json, and .css.d.ts stubs");
