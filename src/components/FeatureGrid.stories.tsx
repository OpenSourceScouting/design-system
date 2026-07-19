import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeatureGrid } from "./FeatureGrid";
import { cn } from "../lib/utils/cn";

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

/**
 * Container queries: the grid responds to its OWN width, not the viewport. This
 * `columns={4}` grid sits in a ~360px box (think a sidebar) and collapses to a
 * single column even on a wide screen, where a viewport-based grid would still
 * show four cramped columns.
 */
export const NarrowContainer: Story = {
  args: {
    columns: 4,
    features: [
      { title: "Adventure", icon: ICONS.adventure, description: "Camp, hike, and explore." },
      { title: "Leadership", icon: ICONS.leadership, description: "Lead a patrol." },
      { title: "Service", icon: ICONS.service, description: "Help other people." },
      { title: "Friendship", icon: ICONS.leadership, description: "Build a den that lasts." },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[360px] rounded-lg border border-border/60 p-3">
        <Story />
      </div>
    ),
  ],
};

/**
 * `renderFeature` replaces the default card entirely while keeping the grid
 * layout. Here each cell becomes a linked "teaser" tile with a background
 * treatment and a Learn more affordance, the kind of custom content the fixed
 * default card cannot express. The whole tile is one link, labelled per
 * feature for screen readers.
 */
export const CustomRenderProp: Story = {
  args: {
    columns: 3,
    features: [
      { title: "Camping", description: "Weekend campouts and week-long summer camp." },
      { title: "High Adventure", description: "Backpacking, sailing, and mountain treks." },
      { title: "STEM", description: "Robotics, coding, and hands-on science." },
    ],
    renderFeature: (f) => (
      <a
        href="#"
        aria-label={`Learn more about ${typeof f.title === "string" ? f.title : "this program"}`}
        className={cn(
          "group relative flex h-48 flex-col justify-end gap-1 overflow-hidden rounded-lg bg-primary p-5",
          "text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        )}
      >
        {/* A background "image" treatment stands in for a real photo here. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/35"
        />
        <span className="display relative text-lg">{f.title}</span>
        <span className="relative font-body text-sm text-primary-foreground/90">
          {f.description}
        </span>
        <span className="relative mt-1 text-sm font-semibold underline underline-offset-4 group-hover:no-underline">
          Learn more
        </span>
      </a>
    ),
  },
};
