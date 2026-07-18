import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EventDialog, EventDialogHeader, EventDialogBody, EventDialogFooter } from "./EventDialog";
import { Button } from "./Button";
import type { CalendarEvent } from "./Calendar";

const meta: Meta<typeof EventDialog> = {
  title: "Programs/EventDialog",
  component: EventDialog,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof EventDialog>;

const SAMPLE: CalendarEvent = {
  id: "demo",
  date: new Date(new Date().getFullYear(), new Date().getMonth(), 19, 16, 0),
  endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 11, 0),
  title: "Webelos Overnight Camp",
  category: "Camping",
  location: "Camp Wokanda · Chillicothe, IL",
  organizer: "Pack 42",
  cost: "$25 per Scout, $15 per adult",
  capacity: "60 Scouts (waitlist after)",
  registrationDeadline: new Date(new Date().getFullYear(), new Date().getMonth(), 14),
  registrationUrl: "https://example.org/register",
  description:
    "Two nights under the stars with cooking, knot-tying, and a campfire program. All Webelos dens are welcome; families encouraged. Bring a tent, sleeping bag, and Class A uniform.\n\nMeet at the Pack 42 hall at 3:30 PM Friday for caravan; pickup is 11:00 AM Sunday at the camp. Adult leaders must have current YPT.",
};

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState<CalendarEvent | null>(null);
    return (
      <div>
        <Button onClick={() => setOpen(SAMPLE)}>Open event detail</Button>
        <EventDialog event={open} onClose={() => setOpen(null)} />
      </div>
    );
  },
};

export const Minimal: Story = {
  render: () => {
    const [open, setOpen] = useState<CalendarEvent | null>(null);
    return (
      <div>
        <Button
          onClick={() =>
            setOpen({
              id: "m",
              date: new Date(),
              title: "Weekly Meeting",
              location: "Unit Hall",
            })
          }
        >
          Open minimal event
        </Button>
        <EventDialog event={open} onClose={() => setOpen(null)} />
      </div>
    );
  },
};

export const CustomActions: Story = {
  render: () => {
    const [open, setOpen] = useState<CalendarEvent | null>(null);
    return (
      <div>
        <Button onClick={() => setOpen(SAMPLE)}>Open with custom actions</Button>
        <EventDialog
          event={open}
          onClose={() => setOpen(null)}
          actions={[
            { label: "Register", variant: "primary", onClick: () => alert("Register clicked") },
            {
              label: "Add to Calendar",
              variant: "secondary",
              onClick: () => alert("ICS download"),
            },
            { label: "Directions", variant: "ghost", onClick: () => alert("Open maps") },
          ]}
        />
      </div>
    );
  },
};

/**
 * The dialog's three regions (Header, Body, Footer) are exported so a consumer
 * can drop them into a custom shell without the native `<dialog>` wrapper. This
 * story composes them inline in a plain rounded panel: use it when embedding
 * event detail in a side sheet, a route page, or a print layout rather than a
 * modal. The header renders on `bg-primary`, so it always previews
 * against the active program color.
 */
export const ComposedManually: Story = {
  render: () => (
    <div className="max-w-lg overflow-hidden rounded-program border border-border/60 shadow-program">
      <EventDialogHeader event={SAMPLE} onClose={() => {}} />
      <EventDialogBody event={SAMPLE} />
      <EventDialogFooter
        actions={[
          { label: "Register", variant: "primary", onClick: () => alert("Register clicked") },
          { label: "Add to Calendar", variant: "secondary", onClick: () => alert("ICS download") },
        ]}
      />
    </div>
  ),
};
