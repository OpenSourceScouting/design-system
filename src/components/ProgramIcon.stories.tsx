import type { Meta, StoryObj } from "@storybook/react-vite";
import { Compass, Flag, Sailboat } from "lucide-react";
import { ProgramIcon } from "./ProgramIcon";
import { PROGRAMS, ScoutThemeProvider } from "../lib/theme/ScoutThemeProvider";

const meta: Meta<typeof ProgramIcon> = {
  title: "Foundations/ProgramIcon",
  component: ProgramIcon,
  parameters: {
    docs: {
      description: {
        component:
          "Open-licensed program glyphs (Lucide, ISC) for UI affordances. " +
          "Unlike ProgramMark, these are not BSA trademarks and may be recolored " +
          "with any text-* utility. Defaults: Cub Scouts → paw print, Scouts BSA → " +
          "tent, Venturing → mountain, Sea Scouts → anchor.",
      },
    },
  },
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96, step: 4 } },
    strokeWidth: { control: { type: "number", min: 1, max: 3, step: 0.25 } },
  },
};
export default meta;

type Story = StoryObj<typeof ProgramIcon>;

export const Default: Story = {
  args: { size: 48 },
};

export const AllPrograms: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {PROGRAMS.map((p) => (
        <ScoutThemeProvider
          key={p}
          program={p}
          className="rounded-program border border-border p-5 flex flex-col items-center gap-3"
        >
          <div className="text-primary">
            <ProgramIcon size={56} />
          </div>
          <span className="display text-xs uppercase tracking-widest">{p}</span>
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};

export const OverrideIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass any Lucide icon via the `icon` prop to override the default. " +
          "Useful when an alternative metaphor fits the context better.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <ScoutThemeProvider
        program="venturing"
        className="rounded-program border border-border p-5 flex flex-col items-center gap-2"
      >
        <ProgramIcon size={40} icon={Compass} />
        <span className="text-xs">Venturing as Compass</span>
      </ScoutThemeProvider>
      <ScoutThemeProvider
        program="scoutsbsa"
        className="rounded-program border border-border p-5 flex flex-col items-center gap-2"
      >
        <ProgramIcon size={40} icon={Flag} />
        <span className="text-xs">Scouts BSA as Flag</span>
      </ScoutThemeProvider>
      <ScoutThemeProvider
        program="seascouts"
        className="rounded-program border border-border p-5 flex flex-col items-center gap-2"
      >
        <ProgramIcon size={40} icon={Sailboat} />
        <span className="text-xs">Sea Scouts as Sailboat</span>
      </ScoutThemeProvider>
    </div>
  ),
};

export const StrokeWeights: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {[1, 1.5, 2, 2.5].map((sw) => (
        <div key={sw} className="flex flex-col items-center gap-2">
          <ProgramIcon size={48} strokeWidth={sw} />
          <span className="text-xs">{sw}</span>
        </div>
      ))}
    </div>
  ),
};
