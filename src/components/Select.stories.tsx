import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, SelectItem } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          "Themed select built on Radix Select. The open list wears the program surface " +
          "(the native `NativeSelect` popup is OS-rendered and cannot). Pass `SelectItem` children. " +
          "Requires a ScoutThemeProvider ancestor (the Storybook preview provides one).",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <Select defaultValue="cub" aria-label="Program">
        <SelectItem value="cub">Cub Scouts</SelectItem>
        <SelectItem value="scoutsbsa">Scouts BSA</SelectItem>
        <SelectItem value="venturing">Venturing</SelectItem>
        <SelectItem value="seascouts">Sea Scouts</SelectItem>
      </Select>
    </div>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <div className="max-w-sm">
      <Select placeholder="Choose a program…" aria-label="Program">
        <SelectItem value="cub">Cub Scouts</SelectItem>
        <SelectItem value="scoutsbsa">Scouts BSA</SelectItem>
      </Select>
    </div>
  ),
};
