import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgramMark } from "./ProgramMark";
import { PROGRAMS, ScoutThemeProvider } from "../lib/theme/ScoutThemeProvider";

const meta: Meta<typeof ProgramMark> = {
  title: "Foundations/ProgramMark",
  component: ProgramMark,
  parameters: {
    docs: {
      description: {
        component:
          "Renders a program mark in one of three variants (color, reversed, mono). " +
          "Auto-loads `/marks/{program}[-variant].svg`; falls back to abstract placeholder SVGs " +
          "(our own work, NOT BSA trademarks) when assets are missing. " +
          "Real assets are never recolored via CSS; the BSA Brand Center license forbids " +
          "derivative works. Use `forcePlaceholder` for contexts where you cannot lawfully " +
          "display the real mark.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["color", "reversed", "mono"] },
    size: { control: "number" },
    forcePlaceholder: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof ProgramMark>;

export const Color: Story = {
  args: { variant: "color", size: 96 },
};

export const Reversed: Story = {
  args: { variant: "reversed", size: 96 },
  render: (args) => (
    <div className="p-6 bg-primary rounded-program inline-block">
      <ProgramMark {...args} />
    </div>
  ),
};

export const Mono: Story = {
  args: { variant: "mono", size: 96 },
  parameters: {
    docs: {
      description: {
        story:
          "Single-color rendition. The BSA Brand Center license permits this variant " +
          "in any dark color, but visible recoloring requires an SVG asset that uses " +
          'fill="currentColor". JPG/PNG renditions display the file\'s baked pixels ' +
          "unchanged.",
      },
    },
  },
};

export const AllVariantsPerProgram: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {PROGRAMS.map((p) => (
        <ScoutThemeProvider
          key={p}
          program={p}
          className="rounded-program border border-border p-5"
        >
          <div className="display text-xs uppercase tracking-widest mb-4 text-muted-foreground">
            {p}
          </div>
          <div className="grid grid-cols-3 gap-3 items-center">
            <div className="flex flex-col items-center gap-2">
              <ProgramMark variant="color" size={64} />
              <span className="text-[10px] uppercase tracking-wider display text-muted-foreground">
                color
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-primary rounded-program">
                <ProgramMark variant="reversed" size={48} />
              </div>
              <span className="text-[10px] uppercase tracking-wider display text-muted-foreground">
                reversed
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-primary">
                <ProgramMark variant="mono" size={64} />
              </div>
              <span className="text-[10px] uppercase tracking-wider display text-muted-foreground">
                mono
              </span>
            </div>
          </div>
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};

export const Placeholders: Story = {
  args: { forcePlaceholder: true, size: 72 },
  parameters: {
    docs: {
      description: {
        story:
          "Force-placeholder mode. These geometric homages are our original work and contain " +
          "no BSA trademarks. Safe to use in portfolio screenshots, open-source demos, and " +
          "any context where the real mark cannot be displayed.",
      },
    },
  },
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {PROGRAMS.map((p) => (
        <ScoutThemeProvider
          key={p}
          program={p}
          className="rounded-program border border-border p-5 flex flex-col items-center gap-3"
        >
          <ProgramMark {...args} program={p} />
          <span className="display text-xs uppercase tracking-widest">{p}</span>
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};
