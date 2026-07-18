import type { Meta, StoryObj } from "@storybook/react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { Button } from "./Button";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Opens the registration form</TooltipContent>
    </Tooltip>
  ),
};
