import type { Meta, StoryObj } from "@storybook/react";
import { Compass, Rocket, Tent, Map, Award, Flag } from "lucide-react";
import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Primitives/Icon",
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          "The general icon primitive. Pass any Lucide icon (imported from `lucide-react`) " +
          "and Icon applies the system's size, stroke, `currentColor` tint, and accessibility " +
          "conventions. Lucide is the recommended set; import glyphs directly rather than " +
          "expecting a bundled catalog. `ProgramIcon` is a preset built on top of this.",
      },
    },
  },
  args: { icon: Compass, size: 24, strokeWidth: 2 },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4 text-primary">
      <Icon icon={Compass} size={16} />
      <Icon icon={Compass} size={24} />
      <Icon icon={Compass} size={32} />
      <Icon icon={Compass} size={48} />
    </div>
  ),
};

export const Tinting: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon icon={Rocket} className="text-primary" />
      <Icon icon={Rocket} className="text-os-accent" />
      <Icon icon={Rocket} className="text-muted-foreground" />
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 text-primary">
      {[Compass, Rocket, Tent, Map, Award, Flag].map((g, i) => (
        <Icon key={i} icon={g} size={28} />
      ))}
    </div>
  ),
};

export const Meaningful: Story = {
  args: { icon: Award, label: "Achievement earned" },
};
