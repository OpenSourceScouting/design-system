import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  args: { children: "Registration closes Friday at 5 PM CT." },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <Alert tone="info" title="Heads up">
        Registration closes Friday at 5 PM CT.
      </Alert>
      <Alert tone="success" title="Approved">
        Your unit charter has been renewed for another year.
      </Alert>
      <Alert tone="warning" title="Action needed">
        Two adult leaders still need YPT training to attend camp.
      </Alert>
      <Alert tone="danger" title="Severe weather">
        Lightning protocol active. Move to substantial shelter immediately.
      </Alert>
    </div>
  ),
};
