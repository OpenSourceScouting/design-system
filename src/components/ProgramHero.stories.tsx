import type { Meta, StoryObj } from "@storybook/react";
import { ProgramHero } from "./ProgramHero";

const meta: Meta<typeof ProgramHero> = {
  title: "Marketing/ProgramHero",
  component: ProgramHero,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProgramHero>;

export const Default: Story = {
  args: {
    eyebrow: "Fall 2026",
    headline: "Where curious minds become confident leaders.",
    lede:
      "From overnight camping to STEM workshops, every meeting is a chance to try something new, build a real skill, and bring it home to share with the people you love.",
    primaryAction: { label: "Find a Unit" },
    secondaryAction: { label: "Watch a Meeting" },
  },
};

export const WithoutLede: Story = {
  args: {
    headline: "Summer camp registration is open.",
    primaryAction: { label: "Join Today" },
  },
};
