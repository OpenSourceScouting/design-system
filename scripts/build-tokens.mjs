/**
 * Regenerates the committed typed token data module
 * (src/lib/tokens/tokens.generated.ts) from the authored src/styles/tokens.css.
 *
 * This file is committed (not a dist artifact) because it is imported by the
 * library source and so must exist for typecheck, dev, and the bundle before
 * `vite build` runs. Run `npm run build:tokens` after editing tokens.css; the
 * `tokens-data` drift test fails CI if the committed module is stale.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseTokens, renderGeneratedTs } from "./tokens-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(path.join(root, "src", "styles", "tokens.css"), "utf8");
const data = parseTokens(css);

const outDir = path.join(root, "src", "lib", "tokens");
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, "tokens.generated.ts"), renderGeneratedTs(data));

console.log("build-tokens: wrote src/lib/tokens/tokens.generated.ts");
