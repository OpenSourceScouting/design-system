import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, type CalendarEvent } from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Programs/Calendar",
  component: Calendar,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Calendar>;

const now = new Date();
const Y = now.getFullYear();
const M = now.getMonth();

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    date: new Date(Y, M, 3, 18, 30),
    title: "Pack Meeting",
    category: "Weekly",
    location: "Pack 42 Hall",
    description: "Den check-ins, advancement, and a short campfire planning session.",
  },
  {
    id: "2",
    date: new Date(Y, M, 10, 18, 30),
    title: "Pack Meeting",
    category: "Weekly",
    location: "Pack 42 Hall",
  },
  {
    id: "3",
    date: new Date(Y, M, 12, 9, 0),
    title: "Service Saturday: Riverbank Cleanup",
    category: "Service",
    location: "Riverside Park",
    description: "Bring gloves and a refillable water bottle. Trash bags provided.",
  },
  {
    id: "4",
    date: new Date(Y, M, 19, 16, 0),
    endDate: new Date(Y, M, 21, 11, 0),
    title: "Webelos Overnight Camp",
    category: "Camping",
    location: "Camp Wokanda · Chillicothe, IL",
    description: "Two nights under the stars with cooking, knot-tying, and a campfire program.",
  },
  {
    id: "5",
    date: new Date(Y, M, 17, 18, 30),
    title: "Pack Meeting",
    category: "Weekly",
    location: "Pack 42 Hall",
  },
  {
    id: "6",
    date: new Date(Y, M, 24, 18, 30),
    title: "Pinewood Derby Build Night",
    category: "Pack Event",
    location: "Pack 42 Hall",
    description: "Tools provided. Bring your block kit and a parent.",
  },
  {
    id: "7",
    date: new Date(Y, M, 26, 10, 0),
    title: "Pinewood Derby Race Day",
    category: "Pack Event",
    location: "Pack 42 Hall",
    description: "Race, awards, snacks. Open to all dens and families.",
  },
  {
    id: "8",
    date: new Date(Y, M + 1, 5, 19, 0),
    endDate: new Date(Y, M + 1, 7, 12, 0),
    title: "Leader Planning Retreat",
    category: "Leadership",
    location: "Council Office",
  },
];

export const Default: Story = {
  args: { events: SAMPLE_EVENTS },
};

/**
 * One event carries `featured: true`, promoting it to the marquee/lead slot in
 * the agenda view: a raised surface, a DecorativeDivider motif, and larger
 * title type. Only the lead story of a program year should be featured.
 */
export const FeaturedMarquee: Story = {
  args: {
    defaultView: "agenda",
    events: [
      {
        id: "marquee",
        date: new Date(Y, M, 19, 16, 0),
        endDate: new Date(Y, M, 21, 11, 0),
        title: "Fall Family Camporee",
        category: "Featured",
        location: "Camp Wokanda · Chillicothe, IL",
        description:
          "The season's headline weekend: campfire program, climbing tower, and the pack cook-off. Families welcome for the whole weekend.",
        featured: true,
      },
      ...SAMPLE_EVENTS.filter((e) => e.id !== "4"),
    ],
  },
};

export const MonthDefault: Story = {
  args: { events: SAMPLE_EVENTS, defaultView: "month" },
};

export const AgendaDefault: Story = {
  args: { events: SAMPLE_EVENTS, defaultView: "agenda" },
};

export const Empty: Story = {
  args: { events: [] },
};

/**
 * `allDay: true` suppresses the time label (a start-of-day date would otherwise
 * read as a misleading "12:00 AM") while keeping the date. Compare the all-day
 * row to the timed Pack Meeting below it.
 */
export const AllDayEvent: Story = {
  args: {
    defaultView: "agenda",
    events: [
      {
        id: "allday",
        date: new Date(Y, M, now.getDate() + 3),
        title: "Scout Sunday (all day)",
        category: "Observance",
        allDay: true,
      },
      {
        id: "timed",
        date: new Date(Y, M, now.getDate() + 4, 18, 30),
        title: "Pack Meeting",
        category: "Weekly",
        location: "Pack 42 Hall",
      },
    ],
  },
};

/**
 * When the agenda window is empty but events exist outside it (here, four
 * months in the past), the calendar prompts the user to switch to Month view to
 * find them rather than just saying "nothing scheduled".
 */
export const EmptyWindowPrompt: Story = {
  args: {
    defaultView: "agenda",
    events: [
      {
        id: "past",
        date: new Date(Y, M - 4, 10, 9, 0),
        title: "Spring Recruitment Night",
        category: "Pack Event",
      },
    ],
  },
};

/**
 * When the calendar's own container is under 640px the month grid is unusable
 * (columns crush to ~50px), so it renders the agenda view and hides the Month
 * toggle even when `defaultView="month"` is requested. This is container-based
 * (a ResizeObserver on the calendar), not viewport-based: here a ~420px wrapper
 * on a wide canvas triggers the fallback, the same way a narrow sidebar would.
 */
export const NarrowContainerFallsBackToAgenda: Story = {
  args: { events: SAMPLE_EVENTS, defaultView: "month" },
  decorators: [
    (Story) => (
      <div className="max-w-[420px] rounded-lg border border-border/60 p-2">
        <Story />
      </div>
    ),
  ],
};
