import type { Preview, Decorator } from "@storybook/react-vite";
import { INITIAL_VIEWPORTS } from "storybook/viewport";
import { ScoutThemeProvider, type Program } from "../src/lib/theme/ScoutThemeProvider";
// Self-hosted fonts (no runtime CDN). Loading them here means Storybook and the
// Playwright test-runner render with locally bundled faces, which is required
// for deterministic visual-regression screenshots.
import "@fontsource-variable/montserrat";
import "@fontsource-variable/montserrat/wght-italic.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
import "../src/styles/globals.css";

/**
 * Every story renders inside <ScoutThemeProvider> so that:
 *   1. The `data-program` attribute is set (CSS variable theming works).
 *   2. The React context is populated (useScoutTheme() works in components
 *      like ProgramHero, RegistrationCTA, ProgramMark, DecorativeDivider).
 *
 * The toolbar global `program` is read from context.globals; switching it from
 * the Storybook top toolbar re-renders every story with the new theme.
 */
const withScoutTheme: Decorator = (Story, context) => {
  const program = (context.globals.program ?? "cub") as Program;
  const forcePlaceholderMarks = context.globals.forcePlaceholderMarks === "on";
  return (
    <ScoutThemeProvider
      program={program}
      forcePlaceholderMarks={forcePlaceholderMarks}
      applyToDocument
    >
      <div className="p-6 min-h-[200px]">
        <Story />
      </div>
    </ScoutThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    layout: "padded",
    backgrounds: { disabled: true },
    controls: { expanded: true },

    // Register the built-in viewport set so stories can select named viewports
    // (e.g. Calendar's `mobile1`) via the SB9 globals API.
    viewport: { options: INITIAL_VIEWPORTS },

    options: {
      storySort: {
        order: ["Introduction", "Foundations", "Primitives", "Marketing", "Programs"],
      },
    },

    a11y: {
      // Fail the addon-vitest browser run on a11y violations (roles, names,
      // labels, ARIA, focus). This replaces the retired test-runner axe pass
      // (ADR 0005 item 2).
      test: "error",
      // color-contrast is deferred to tests/contrast.test.ts, which checks it
      // exhaustively per program (base pairs + /80 and /85 composites). Leaving
      // it on here duplicates that work and produces noisier, less precise
      // failures. Do not re-enable (ADR 0005).
      config: {
        rules: [{ id: "color-contrast", enabled: false }],
      },
    },
  },

  // SB9: global defaults live in initialGlobals, not globalTypes.defaultValue.
  initialGlobals: {
    program: "cub",
    forcePlaceholderMarks: "off",
  },

  globalTypes: {
    program: {
      name: "Program",
      description: "Active Scouting America program theme",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "cub", title: "Cub Scouts" },
          { value: "scoutsbsa", title: "Scouts BSA" },
          { value: "venturing", title: "Venturing" },
          { value: "seascouts", title: "Sea Scouts" },
        ],
        dynamicTitle: true,
      },
    },
    forcePlaceholderMarks: {
      name: "Marks",
      description: "Force placeholder marks (hides real BSA assets)",
      toolbar: {
        icon: "photo",
        items: [
          { value: "off", title: "Real marks (when available)" },
          { value: "on", title: "Force placeholders" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [withScoutTheme],
  tags: ["autodocs"],
};

export default preview;
