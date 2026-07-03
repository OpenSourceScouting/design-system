import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const preset = require("./tailwind-preset.cjs") as Partial<Config>;

/**
 * Tailwind v3 config for this repo's own showcase + Storybook builds.
 *
 * The design tokens (program colors, sa palette, fonts, radii, shadows, and the
 * display typography utilities) live in `tailwind-preset.cjs`, which is the
 * single source of truth and is also published for consumers via
 * `presets: [require("@openscouting/design-system/tailwind-preset")]`.
 * This config only adds the repo-local `content` globs so the same tokens power
 * both the published library and the local demo/Storybook without duplication.
 */
const config: Config = {
  presets: [preset as Partial<Config>],
  content: ["./index.html", "./src/**/*.{ts,tsx,mdx}", "./.storybook/**/*.{ts,tsx}"],
  plugins: [],
};

export default config;
