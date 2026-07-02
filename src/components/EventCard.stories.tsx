import type { Meta, StoryObj } from "@storybook/react";
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
