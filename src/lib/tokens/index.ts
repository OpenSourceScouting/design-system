/**
 * Framework-neutral design-token data (task 2.3).
 *
 * A typed, importable view of the design tokens, mirroring how {@link
 * SCOUTING_LINKS} exposes canonical URLs as versioned data. Use it when you
 * need a brand value in JavaScript rather than as a Tailwind utility or CSS
 * variable: passing a color to a charting library, a `<canvas>`, an SVG
 * generator, React Native `StyleSheet`, or an email builder.
 *
 * The authored source of truth is `src/styles/tokens.css`; this data is
 * generated from it (see `scripts/build-tokens.mjs`), so it never drifts. For
 * non-JavaScript consumers (Figma/Tokens Studio, SCSS, email) the same data is
 * emitted as files: the `./tokens.json`, `./tokens.scss`, and
 * `./tokens.email.json` package subpaths. Print (CMYK/Pantone) equivalents are
 * a separate artifact, `./tokens.print.json` (task 3.4).
 *
 * @example
 * import { TOKENS } from "@opensourcescouting/design-system";
 * TOKENS.cub.colors["os-accent"].hex; // "#FDC116"
 * TOKENS.cub.colors.primary.rgb;      // [0, 63, 135]
 */
export { TOKENS } from "./tokens.generated";
import { TOKENS } from "./tokens.generated";

/** A palette key: "root" (parent brand) or one of the four programs. */
export type TokenPalette = keyof typeof TOKENS;

/** A color token: the source RGB triplet plus its #RRGGBB hex. */
export type TokenColor = {
  readonly rgb: readonly [number, number, number];
  readonly hex: string;
};
