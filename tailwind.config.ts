import type { Config } from "tailwindcss";

/**
 * Tailwind v3 design-system config.
 *
 * Two color layers:
 *  1. `sa.*`        — raw Scouting America palette (page 14-15 of 2024 Brand Guidelines).
 *                     Available everywhere; do not theme-swap. Use for cross-program UI
 *                     (footers, system messages, neutral surfaces).
 *  2. `program.*`   — semantic tokens that resolve to CSS custom properties.
 *                     Re-bound per program by ScoutThemeProvider. Use in components
 *                     so they re-theme automatically.
 *
 * Font families are also driven by CSS variables, set per program.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,mdx}", "./.storybook/**/*.{ts,tsx}"],
  theme: {
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
          /** Muted body text. Verified ≥4.5:1 contrast against program-surface per WCAG 2.1 AA. */
          "on-surface-soft": "rgb(var(--program-on-surface-soft) / <alpha-value>)",
          /** Inactive/dim text (placeholders, out-of-month days). Verified ≥3:1 (large-text AA / 1.4.11). */
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
        display: "var(--program-display-weight)" as unknown as string,
      },
      letterSpacing: {
        display: "var(--program-display-tracking)" as unknown as string,
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
  },
  plugins: [],
};

export default config;
