import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { EventCard } from "./EventCard";

const meta: Meta<typeof EventCard> = {
  title: "Programs/EventCard",
  component: EventCard,
};
export default meta;

type Story = StoryObj<typeof EventCard>;

export const Single: Story = {
  args: {
    date: new Date(2026, 8, 19, 14, 0),
    title: "Webelos Overnight Camp",
    location: "Camp Wokanda · Chillicothe, IL",
    description:
      "Two nights under the stars with cooking, knot-tying, and a campfire program. Open to all Webelos dens and their families.",
    category: "Camping",
    cta: { label: "Register" },
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
      <EventCard
        date={new Date(2026, 5, 14, 9, 0)}
        title="Pinewood Derby Weekend"
        location="Pack 42 Hall"
        category="Pack Event"
        description="Race your custom car against your friends. Prizes, snacks, and trophy ceremony."
        cta={{ label: "RSVP" }}
      />
      <EventCard
        date={new Date(2026, 6, 22, 18, 30)}
        title="Service Night: Riverbank Cleanup"
        location="Riverside Park"
        category="Service"
        description="Bring gloves and a refillable water bottle. Trash bags provided."
        cta={{ label: "Sign Up" }}
      />
      <EventCard
        date={new Date(2026, 7, 5, 7, 0)}
        title="Summit Backpacking Crew"
        location="Sangre de Cristo Range"
        category="High Adventure"
        description="Four-day, three-night high-altitude trek. Crew limit 12; YPT required for adults."
        cta={{ label: "Join Roster" }}
      />
      <EventCard
        date={new Date(2026, 9, 10, 10, 0)}
        title="Open Boats Day"
        location="Lake Michigan Marina"
        category="Sea Scouts"
        description="Tour the fleet, learn basic seamanship, meet active Sea Scouts. Lunch provided."
        cta={{ label: "Reserve Spot" }}
      />
    </div>
  ),
};

/**
 * A multi-day event uses `renderDateBlock` to replace the single month/day
 * tear with a start-to-end range. The renderer receives both `date` and
 * `endDate`, so a range can be drawn without any branching inside EventCard.
 */
export const CustomDateBlock: Story = {
  args: {
    date: new Date(2026, 6, 24, 15, 0),
    endDate: new Date(2026, 6, 26, 11, 0),
    title: "Summer Resident Camp",
    location: "Camp Emerald · Wisconsin Northwoods",
    category: "Camping",
    description:
      "Three days and two nights of aquatics, shooting sports, and merit-badge sessions. Bus departs the council office Friday afternoon.",
    cta: { label: "Register" },
    renderDateBlock: (date, endDate) => (
      <div
        aria-hidden
        className="shrink-0 w-20 rounded-program overflow-hidden bg-primary text-primary-foreground flex flex-col items-center justify-center py-2 border border-primary"
      >
        <span className="display text-[10px] uppercase tracking-[0.2em]">
          {date.toLocaleDateString(undefined, { month: "short" })}
        </span>
        <span className="display text-2xl leading-none">{date.getDate()}</span>
        {endDate ? (
          <>
            <span className="display text-[10px] leading-none opacity-80">to</span>
            <span className="display text-2xl leading-none">{endDate.getDate()}</span>
          </>
        ) : null}
      </div>
    ),
  },
};

/**
 * With a `cta.href` and a `navigate` handler, clicking the CTA routes through
 * the consumer's SPA router instead of a hard `window.location` redirect. Open
 * the Actions panel to watch the logged navigation calls.
 */
export const WithNavigateHandler: Story = {
  args: {
    date: new Date(2026, 8, 12, 8, 30),
    title: "Council Camporee",
    location: "Rocky Ridge Scout Reservation",
    category: "District Event",
    description:
      "Patrols from across the council compete in orienteering, first aid, and pioneering. Register your unit and reserve a campsite.",
    cta: { label: "View Details", href: "/events/council-camporee" },
    navigate: (url: string) => action("navigate")(url),
  },
};
