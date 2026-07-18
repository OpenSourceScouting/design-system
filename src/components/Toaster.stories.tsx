import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster, toast } from "./Toaster";
import { Button } from "./Button";

const meta: Meta<typeof Toaster> = {
  title: "Overlays/Toaster",
  component: Toaster,
};
export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <div className="flex gap-3">
        <Button onClick={() => toast("Registration confirmed for Fall Camporee.")}>
          Show toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.success("You're on the list!", {
              description: "Confirmation sent to your email.",
            })
          }
        >
          Success toast
        </Button>
      </div>
    </div>
  ),
};
