import type { Meta, StoryObj } from "@storybook/react-vite";
import { MadeWithBadge } from "./MadeWithBadge";

const meta: Meta<typeof MadeWithBadge> = {
  title: "Brand/MadeWithBadge",
  component: MadeWithBadge,
  parameters: {
    docs: {
      description: {
        component:
          "A drop-in attribution badge. Self-contained (inline styles + inline SVG mark), " +
          "so it renders correctly in any app without importing the library CSS or setting a " +
          "program theme. It always shows the fixed Open Source Scouting brand, never the " +
          "consumer's active program.",
      },
    },
  },
  args: { variant: "light", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["light", "dark"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
};
export default meta;

type Story = StoryObj<typeof MadeWithBadge>;

export const Light: Story = { args: { variant: "light" } };

export const Dark: Story = {
  args: { variant: "dark" },
  render: (args) => (
    <div style={{ background: "#1a1a1a", padding: 24, borderRadius: 8 }}>
      <MadeWithBadge {...args} />
    </div>
  ),
  globals: {
    backgrounds: {
      value: "dark",
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <MadeWithBadge size="sm" />
      <MadeWithBadge size="md" />
    </div>
  ),
};

export const OnLightAndDark: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ background: "#f7f5ef", padding: 24, borderRadius: 8 }}>
        <MadeWithBadge variant="light" />
      </div>
      <div style={{ background: "#245235", padding: 24, borderRadius: 8 }}>
        <MadeWithBadge variant="dark" />
      </div>
    </div>
  ),
};
