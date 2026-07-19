/**
 * CSS build step for the published package.
 *
 * Vite's library mode cannot take a CSS file as a rollup input (and would inline
 * a component-scoped chunk rather than the fully Tailwind-processed stylesheet we
 * want), so the two CSS exports are produced here instead:
 *
 *   dist/styles.css: library.css run through Tailwind v4 (@import "tailwindcss"
 *                      plus the @theme mapping and token variables). This is the
 *                      "batteries included" import:
 *                      "@opensourcescouting/design-system/styles". The source
 *                      scan is scoped to src/ inside library.css, so only the
 *                      shipped components' utilities are emitted.
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
import { copyFileSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseTokens, renderJson, renderScss, renderEmailJson } from "./tokens-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
mkdirSync(dist, { recursive: true });

// 1. Tailwind-process library.css into dist/styles.css (v4 CLI, @tailwindcss/cli).
const tailwindBin = path.join(root, "node_modules", ".bin", "tailwindcss");
execFileSync(
  tailwindBin,
  [
    "-i",
    path.join(root, "src", "styles", "library.css"),
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

// 2c. Ship theme.css verbatim (the v4 @theme mapping, replacing the retired
//     tailwind-preset). Consumers running their own Tailwind v4 build import it
//     alongside tokens.css to regenerate the program/shadcn utilities:
//       @import "tailwindcss";
//       @import "@opensourcescouting/design-system/tokens";
//       @import "@opensourcescouting/design-system/theme";
copyFileSync(path.join(root, "src", "styles", "theme.css"), path.join(dist, "theme.css"));

// 3. Emit ambient declaration stubs so TS "bundler" resolution accepts the
//    side-effect CSS imports (fixes TS2882).
const cssStub = "// Ambient stub for a side-effect CSS import. No runtime value.\nexport {};\n";
writeFileSync(path.join(dist, "styles.css.d.ts"), cssStub);
writeFileSync(path.join(dist, "tokens.css.d.ts"), cssStub);

// 4. Framework-neutral token FILE artifacts, for tools that consume tokens by
//    file rather than by import (Figma/Tokens Studio, SCSS, email builders).
//    Generated from the same tokens.css parse as the committed `TOKENS` export
//    (scripts/tokens-data.mjs). Emitted here, AFTER `vite build`, because Vite
//    empties dist/ at the start of its build and would wipe an earlier write.
const tokenData = parseTokens(readFileSync(path.join(root, "src", "styles", "tokens.css"), "utf8"));
const tokensDir = path.join(dist, "tokens");
mkdirSync(tokensDir, { recursive: true });
writeFileSync(path.join(tokensDir, "tokens.json"), renderJson(tokenData));
writeFileSync(path.join(tokensDir, "tokens.scss"), renderScss(tokenData));
writeFileSync(path.join(tokensDir, "tokens.email.json"), renderEmailJson(tokenData));

console.log(
  "build-css: wrote dist/styles.css, dist/tokens.css, dist/tokens.print.json, dist/tokens/{tokens.json,tokens.scss,tokens.email.json}, and .css.d.ts stubs",
);
