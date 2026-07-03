import type { Config } from "tailwindcss";

/**
 * Scouting America Design System Tailwind preset.
 *
 * Contributes only `theme.extend` (program + sa colors, display fonts/weights/
 * tracking, program radius, rule border width, and program shadow). Wire it in
 * via `presets: [require("@scouting-america/design-system/tailwind-preset")]`.
 */
declare const preset: Pick<Config, "theme">;
export = preset;
