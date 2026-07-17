import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Forms/TextInput",
  component: TextInput,
  args: { placeholder: "Pack 42" },
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <TextInput {...args} />
    </div>
  ),
};
export const Invalid: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <TextInput {...args} invalid defaultValue="oops" />
    </div>
  ),
};
export const Disabled: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <TextInput {...args} disabled defaultValue="Locked" />
    </div>
  ),
};
