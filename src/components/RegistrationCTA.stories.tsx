import type { Meta, StoryObj } from "@storybook/react";
import { RegistrationCTA } from "./RegistrationCTA";

const meta: Meta<typeof RegistrationCTA> = {
  title: "Marketing/RegistrationCTA",
  component: RegistrationCTA,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof RegistrationCTA>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    headline: "Charter your crew before September.",
    body: "Unit charters submitted by September 15 receive priority placement for council activities.",
    primaryLabel: "Start Charter",
  },
};
