import type { Meta, StoryObj } from "@storybook/react-vite";
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
    lede: "From overnight camping to STEM workshops, every meeting is a chance to try something new, build a real skill, and bring it home to share with the people you love.",
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

/**
 * `watermark={false}` suppresses the built-in decorative mark entirely. Use
 * this when the hero sits on top of a photograph that already carries a mark,
 * or when the surrounding layout provides its own branding.
 */
export const WithoutWatermark: Story = {
  args: {
    eyebrow: "New Program Year",
    headline: "Adventure starts the day you say yes.",
    lede: "Join a den this fall and spend the year hiking, building, camping, and earning the adventures that turn into stories worth retelling.",
    primaryAction: { label: "Find a Unit" },
    secondaryAction: { label: "Talk to a Leader" },
    watermark: false,
  },
};
