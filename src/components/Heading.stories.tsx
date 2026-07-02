import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading";

const meta: Meta<typeof Heading> = {
  title: "Primitives/Heading",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level={1} size={1}>Adventure starts here</Heading>
      <Heading level={2} size={2}>Adventure starts here</Heading>
      <Heading level={3} size={3}>Adventure starts here</Heading>
      <Heading level={4} size={4}>Adventure starts here</Heading>
      <Heading level={5} size={5}>Adventure starts here</Heading>
      <Heading level={6} size={6}>Adventure starts here</Heading>
    </div>
  ),
};

export const Serif: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level={2} size={2} serif>A century of preparation</Heading>
      <Heading level={2} size={2}>A century of preparation</Heading>
    </div>
  ),
};
