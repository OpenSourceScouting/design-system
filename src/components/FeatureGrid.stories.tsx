import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeatureGrid } from "./FeatureGrid";

const meta: Meta<typeof FeatureGrid> = {
  title: "Marketing/FeatureGrid",
  component: FeatureGrid,
};
export default meta;

type Story = StoryObj<typeof FeatureGrid>;

const ICONS = {
  adventure: (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 20 L9 8 L13 14 L17 6 L21 20 Z" />
    </svg>
  ),
  leadership: (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M4 21 q0-6 8-6 t8 6" />
    </svg>
  ),
  service: (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
    </svg>
  ),
};

export const Three: Story = {
  args: {
    columns: 3,
    features: [
      {
        title: "Adventure",
        icon: ICONS.adventure,
        description:
          "From a mountaintop to a STEM lab, Scouting offers experiences that pull kids out of the routine and into something they will remember.",
      },
      {
        title: "Leadership",
        icon: ICONS.leadership,
        description:
          "Patrol leaders, crew presidents, and senior patrol leaders learn to make decisions, run meetings, and own outcomes.",
      },
      {
        title: "Service",
        icon: ICONS.service,
        description:
          "Helping other people at all times is a daily habit, from neighborhood cleanups to Eagle service projects that reshape communities.",
      },
    ],
  },
};

/**
 * Two columns give each card more room, suited to longer descriptions or a
 * "pillars of the program" band above the fold.
 */
export const Two: Story = {
  args: {
    columns: 2,
    features: [
      {
        title: "Outdoor Adventure",
        icon: ICONS.adventure,
        description:
          "Camping, hiking, and high-adventure treks teach Scouts to plan a trip, pack for it, and thrive miles from the nearest road.",
      },
      {
        title: "Character & Service",
        icon: ICONS.service,
        description:
          "Weekly good turns and Eagle service projects turn the Scout Oath and Law into a habit that outlasts the program.",
      },
    ],
  },
};

/**
 * Four columns compress each card, best for a scannable feature strip with
 * short titles and one-line descriptions.
 */
export const Four: Story = {
  args: {
    columns: 4,
    features: [
      {
        title: "Adventure",
        icon: ICONS.adventure,
        description: "Camp, hike, and explore the outdoors.",
      },
      {
        title: "Leadership",
        icon: ICONS.leadership,
        description: "Lead a patrol and own the outcome.",
      },
      {
        title: "Service",
        icon: ICONS.service,
        description: "Help other people at all times.",
      },
      {
        title: "Friendship",
        icon: ICONS.leadership,
        description: "Build a den, patrol, or crew that lasts.",
      },
    ],
  },
};
