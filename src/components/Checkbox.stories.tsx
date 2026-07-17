import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => <Checkbox label="I have read the health form" />,
};

export const WithDescription: Story = {
  render: () => (
    <Checkbox
      defaultChecked
      label="Photo release"
      description="Allow the pack to use event photos in the newsletter."
    />
  ),
};
