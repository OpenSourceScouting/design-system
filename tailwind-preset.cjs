/**
 * Scouting America Design System: Tailwind preset (single source of truth).
 *
 * Consumers wire this into their own Tailwind config:
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require("@opensourcescouting/design-system/tailwind-preset")],
 *     content: [
 *       "./src/**\/*.{ts,tsx}",
 *       // scan the shipped components so their utility classes are generated:
 *       "./node_modules/@opensourcescouting/design-system/dist/**\/*.{js,cjs}",
 *     ],
 *   };
 *
 * The preset only contributes `theme.extend`. It carries no `content` globs so
 * that each consuming app controls what gets scanned. The repo's own
 * tailwind.config.ts consumes this same preset so there is exactly one place
 * that defines the palette, fonts, radii, shadows, and display utilities.
 *
 * Two color layers:
 *   1. `sa.*`    : raw Scouting America palette (2024 Brand Guidelines p.14-15).
 *                    Fixed values; never theme-swapped. Use for cross-program UI.
 *   2. `program.*`: semantic tokens resolving to CSS custom properties that
 *                    ScoutThemeProvider re-binds per program via `data-program`.
 *                    These require the design system's CSS (import
 *                    "@opensourcescouting/design-system/styles") to be loaded so
 *                    the `--program-*` variables exist.
 */

/** @type {import("tailwindcss").Config["theme"]} */
const theme = {
  extend: {
    colors: {
      sa: {
        red: "#CE1126",
        blue: "#003F87",
        tan: "#D6CEBD",
        gray: "#515354",
        white: "#FFFFFF",
        "pale-blue": "#9AB3D5",
        "dark-blue": "#003366",
        "light-tan": "#E9E9E4",
        "dark-tan": "#AD9D7B",
        "pale-gray": "#858787",
        "dark-gray": "#232528",
      },
      program: {
        primary: "rgb(var(--program-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--program-on-primary) / <alpha-value>)",
        "on-primary-soft": "rgb(var(--program-on-primary-soft) / <alpha-value>)",
        accent: "rgb(var(--program-accent) / <alpha-value>)",
        "on-accent": "rgb(var(--program-on-accent) / <alpha-value>)",
        surface: "rgb(var(--program-surface) / <alpha-value>)",
        "on-surface": "rgb(var(--program-on-surface) / <alpha-value>)",
        /** Muted body text. Verified >=4.5:1 contrast against program-surface per WCAG 2.1 AA. */
        "on-surface-soft": "rgb(var(--program-on-surface-soft) / <alpha-value>)",
        /** Inactive/dim text (placeholders, out-of-month days). Verified >=3:1 (large-text AA / 1.4.11). */
        "on-surface-faint": "rgb(var(--program-on-surface-faint) / <alpha-value>)",
        "surface-muted": "rgb(var(--program-surface-muted) / <alpha-value>)",
        "on-surface-muted": "rgb(var(--program-on-surface-muted) / <alpha-value>)",
        border: "rgb(var(--program-border) / <alpha-value>)",
        ring: "rgb(var(--program-ring) / <alpha-value>)",
        decor: "rgb(var(--program-decor) / <alpha-value>)",
      },
    },
    fontFamily: {
      display: "var(--program-font-display)",
      body: "var(--program-font-body)",
    },
    fontWeight: {
      display: "var(--program-display-weight)",
    },
    letterSpacing: {
      display: "var(--program-display-tracking)",
    },
    borderRadius: {
      program: "var(--program-radius)",
    },
    borderWidth: {
      rule: "var(--program-rule-weight)",
    },
    boxShadow: {
      program: "var(--program-shadow)",
    },
  },
};

/** @type {Partial<import("tailwindcss").Config>} */
module.exports = {
  theme,
};
