/**
 * Shared token-data pipeline (task 2.3).
 *
 * Single source of the logic that turns the AUTHORED `src/styles/tokens.css`
 * (the source of truth, with brand-guideline citations in its comments) into
 * framework-neutral artifacts. Imported by two build scripts so the parse lives
 * in one place:
 *
 *   - scripts/build-tokens.mjs  -> the committed typed data module
 *                                  (src/lib/tokens/tokens.generated.ts), which
 *                                  feeds the `TOKENS` package export.
 *   - scripts/build-css.mjs     -> the dist file artifacts (tokens.json,
 *                                  tokens.scss, tokens.email.json) for tools
 *                                  that consume tokens by file, not by import
 *                                  (Figma, SCSS projects, email builders).
 *
 * Colors in tokens.css are stored as space-separated RGB triplets (so Tailwind
 * v4 can composite alpha via color-mix); here they are surfaced as both the
 * triplet and a `#RRGGBB` hex. Non-color declarations (radius, rule weight,
 * shadow, display type, fonts) are carried through verbatim as strings.
 */

/** The five palette blocks, keyed by the name used in the emitted data. */
export const PALETTE_SELECTORS = {
  root: ":root",
  cub: '[data-program="cub"]',
  scoutsbsa: '[data-program="scoutsbsa"]',
  venturing: '[data-program="venturing"]',
  seascouts: '[data-program="seascouts"]',
};

/** Convert an 8-bit RGB triplet to an uppercase #RRGGBB hex string. */
export function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** Extract the declaration body of a single CSS block by its literal selector. */
function blockBody(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|\\n)\\s*${escaped}\\s*\\{([\\s\\S]*?)\\}`, "m");
  const match = css.match(re);
  if (!match) {
    throw new Error(`tokens.css: could not find the block for selector ${selector}`);
  }
  return match[2];
}

/**
 * Parse tokens.css into `{ [palette]: { colors, values } }`.
 *   colors: { [name]: { rgb: [r,g,b], hex: "#RRGGBB" } }  (triplet declarations)
 *   values: { [name]: string }                             (everything else)
 * Names drop the leading `--` (e.g. `--os-accent` -> `os-accent`).
 */
export function parseTokens(css) {
  const out = {};
  for (const [palette, selector] of Object.entries(PALETTE_SELECTORS)) {
    const body = blockBody(css, selector);
    const colors = {};
    const values = {};
    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let m;
    while ((m = declRe.exec(body)) !== null) {
      const name = m[1].slice(2);
      const raw = m[2].trim();
      const triplet = raw.match(/^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/);
      if (triplet) {
        const rgb = [Number(triplet[1]), Number(triplet[2]), Number(triplet[3])];
        colors[name] = { rgb, hex: rgbToHex(rgb) };
      } else {
        values[name] = raw;
      }
    }
    out[palette] = { colors, values };
  }
  return out;
}

const DO_NOT_EDIT =
  "GENERATED FILE - DO NOT EDIT.\n" +
  " * Source of truth: src/styles/tokens.css\n" +
  " * Regenerate with: npm run build:tokens";

/** The committed TypeScript data module that backs the `TOKENS` export. */
export function renderGeneratedTs(data) {
  return `/* ${DO_NOT_EDIT} */\n\nexport const TOKENS = ${JSON.stringify(data, null, 2)} as const;\n`;
}

/** Structured JSON artifact: full token set per palette (rgb + hex + values). */
export function renderJson(data) {
  return (
    JSON.stringify(
      {
        _comment:
          "Framework-neutral design tokens generated from src/styles/tokens.css. Do not edit by hand. Colors carry both an [r,g,b] triplet and a #RRGGBB hex; non-color tokens are raw CSS strings. Print (CMYK/Pantone) equivalents are in tokens.print.json.",
        programs: data,
      },
      null,
      2,
    ) + "\n"
  );
}

/**
 * Hex-only, flat-per-palette JSON for email tools (Mailchimp, Constant Contact)
 * that cannot use CSS variables and need paste-ready literals. Colors only.
 */
export function renderEmailJson(data) {
  const programs = {};
  for (const [palette, block] of Object.entries(data)) {
    programs[palette] = {};
    for (const [name, color] of Object.entries(block.colors)) {
      programs[palette][name] = color.hex;
    }
  }
  return (
    JSON.stringify(
      {
        _comment:
          "Hex-only, flattened design tokens for email clients (no CSS variables, no opacity composites). One map of paste-ready #RRGGBB literals per program. Generated from src/styles/tokens.css; do not edit.",
        programs,
      },
      null,
      2,
    ) + "\n"
  );
}

/**
 * Flat hex utility classes for HTML email, one set per palette (no CSS
 * variables, since email clients do not support them). Class shape is
 * `.{palette}-{token}-bg` / `.{palette}-{token}-text`. Many email clients strip
 * `<style>` blocks, so inline styles (see examples/email-template) are the
 * primary path; these classes serve the clients that DO honor embedded styles.
 */
export function renderEmailCss(data) {
  const header =
    "/* GENERATED from src/styles/tokens.css. Do not edit.\n" +
    " * Flat hex utility classes for HTML email (no CSS variables). One set per\n" +
    " * program: .{program}-{token}-bg / .{program}-{token}-text. Many email\n" +
    " * clients strip <style>; prefer inline styles (see examples/email-template).\n" +
    " */\n\n";
  const blocks = Object.entries(data)
    .map(([palette, block]) => {
      const rules = Object.entries(block.colors)
        .flatMap(([name, color]) => [
          `.${palette}-${name}-bg { background-color: ${color.hex}; }`,
          `.${palette}-${name}-text { color: ${color.hex}; }`,
        ])
        .join("\n");
      return `/* ${palette} */\n${rules}`;
    })
    .join("\n\n");
  return header + blocks + "\n";
}

/** SCSS map of the color tokens (hex) per palette, for SCSS/Sass consumers. */
export function renderScss(data) {
  const header =
    "// GENERATED from src/styles/tokens.css by scripts/build-css.mjs. Do not edit.\n" +
    "// Colors only (hex). Non-color tokens (radius, shadow, fonts) live in tokens.json.\n" +
    '// Usage: @use "tokens.scss"; map.get(map.get($sa-tokens, "cub"), "primary");\n\n';
  const blocks = Object.entries(data)
    .map(([palette, block]) => {
      const entries = Object.entries(block.colors)
        .map(([name, color]) => `    "${name}": ${color.hex}`)
        .join(",\n");
      return `  "${palette}": (\n${entries}\n  )`;
    })
    .join(",\n");
  return `${header}$sa-tokens: (\n${blocks}\n);\n`;
}
