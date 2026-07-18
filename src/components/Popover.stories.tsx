import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Button } from "./Button";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Trip details</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-1">
          <p className="display text-sm">Camp Alpine</p>
          <p className="text-sm text-muted-foreground">
            Gather at the trailhead by 8:00 AM. Bring a day pack and full water bottle.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
