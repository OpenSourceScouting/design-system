import type { Meta, StoryObj } from "@storybook/react";
import { DecorativeDivider } from "./DecorativeDivider";
import { PROGRAMS, ScoutThemeProvider } from "../lib/theme/ScoutThemeProvider";

const meta: Meta<typeof DecorativeDivider> = {
  title: "Foundations/DecorativeDivider",
  component: DecorativeDivider,
};
export default meta;

type Story = StoryObj<typeof DecorativeDivider>;

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {PROGRAMS.map((p) => (
        <ScoutThemeProvider
          key={p}
          program={p}
          className="p-5 rounded-program border border-border"
        >
          <div className="display text-xs uppercase tracking-widest mb-3 text-muted-foreground">
            {p}
          </div>
          <DecorativeDivider />
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};
