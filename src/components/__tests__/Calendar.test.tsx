import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Calendar, type CalendarEvent } from "../Calendar";
import { renderThemed } from "./testUtils";

// Anchor events relative to "now" so the agenda window (default 60 days from
// today) always contains them regardless of when the suite runs.
function daysFromNow(days: number, hour = 9): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

const EVENTS: CalendarEvent[] = [
  {
    id: "1",
    date: daysFromNow(7, 9),
    title: "Fall Camporee",
    category: "Camporee",
    location: "Camp Alpine",
  },
  {
    id: "2",
    date: daysFromNow(20, 18),
    title: "Pack Meeting",
    category: "Meeting",
  },
];

// A month that definitely contains an event, for the month-view tests.
const EVENT_MONTH = EVENTS[0].date;

describe("Calendar", () => {
  it("renders agenda view", () => {
    renderThemed(
      <Calendar events={EVENTS} defaultView="agenda" />,
    );
    expect(screen.getByText("Fall Camporee")).toBeInTheDocument();
    expect(screen.getByText("Pack Meeting")).toBeInTheDocument();
  });

  it("renders month view", () => {
    renderThemed(<Calendar events={EVENTS} defaultView="month" defaultMonth={EVENT_MONTH} />);
    // Month heading shows the month name of the anchored event month.
    const monthName = EVENT_MONTH.toLocaleDateString("en-US", { month: "long" });
    expect(screen.getByText(new RegExp(monthName, "i"))).toBeInTheDocument();
  });

  it("has no axe violations (agenda)", async () => {
    const { container } = renderThemed(<Calendar events={EVENTS} defaultView="agenda" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (month)", async () => {
    const { container } = renderThemed(
      <Calendar events={EVENTS} defaultView="month" defaultMonth={EVENT_MONTH} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
