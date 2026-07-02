import type { Meta, StoryObj } from "@storybook/react";
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
 * Below the `sm` breakpoint the month grid is unusable (columns crush to
 * ~50px), so the calendar renders the agenda view and hides the Month toggle
 * even when `defaultView="month"` is requested. Resize the canvas above
 * 640px to watch the month grid and toggle come back.
 */
export const MobileFallsBackToAgenda: Story = {
  args: { events: SAMPLE_EVENTS, defaultView: "month" },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
