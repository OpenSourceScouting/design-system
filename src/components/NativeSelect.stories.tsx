import type { Meta, StoryObj } from "@storybook/react";
import { NativeSelect } from "./NativeSelect";

const meta: Meta<typeof NativeSelect> = {
  title: "Forms/NativeSelect",
  component: NativeSelect,
};
export default meta;

type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <NativeSelect defaultValue="cub">
        <option value="cub">Cub Scouts</option>
        <option value="scoutsbsa">Scouts BSA</option>
        <option value="venturing">Venturing</option>
        <option value="seascouts">Sea Scouts</option>
      </NativeSelect>
    </div>
  ),
};
