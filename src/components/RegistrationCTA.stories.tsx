import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
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

/**
 * `watermark={false}` removes the reversed program mark from the banner, giving
 * the copy the full width of the panel. Useful when the CTA is stacked directly
 * beneath a hero that already carries the mark.
 */
export const WithoutWatermark: Story = {
  args: {
    headline: "One weekend can change a Scout's year.",
    body: "Fall recruitment nights run through October. Bring a friend and sign up together.",
    primaryLabel: "See Upcoming Nights",
    watermark: false,
  },
};

/**
 * With a `primaryHref` and a `navigate` handler, the primary button routes
 * through the consumer's SPA router instead of assigning `window.location`.
 * Click the button and watch the Actions panel for the logged navigation.
 */
export const WithNavigateHandler: Story = {
  args: {
    headline: "Ready to find your unit?",
    primaryLabel: "Find a Unit Near You",
    primaryHref: "/join",
    navigate: (url: string) => action("navigate")(url),
  },
};
