import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
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
    renderThemed(<Calendar events={EVENTS} defaultView="agenda" />);
    expect(screen.getByText("Fall Camporee")).toBeInTheDocument();
    expect(screen.getByText("Pack Meeting")).toBeInTheDocument();
  });

  it("renders month view", () => {
    renderThemed(<Calendar events={EVENTS} defaultView="month" defaultMonth={EVENT_MONTH} />);
    // Month heading shows the month name of the anchored event month.
    const monthName = EVENT_MONTH.toLocaleDateString("en-US", { month: "long" });
    expect(screen.getByText(new RegExp(monthName, "i"))).toBeInTheDocument();
  });

  it("shows a time label for a timed agenda event", () => {
    const { container } = renderThemed(
      <Calendar
        events={[{ id: "t", date: daysFromNow(5, 9), title: "Timed" }]}
        defaultView="agenda"
      />,
    );
    expect(container.textContent).toMatch(/\d{1,2}:\d{2}/);
  });

  it("suppresses the time label for an all-day agenda event", () => {
    const { container } = renderThemed(
      <Calendar
        events={[{ id: "a", date: daysFromNow(5, 0), title: "All Day", allDay: true }]}
        defaultView="agenda"
      />,
    );
    expect(screen.getByText("All Day")).toBeInTheDocument();
    // No "9:00" / "12:00 AM" style label anywhere in the agenda row.
    expect(container.textContent).not.toMatch(/\d{1,2}:\d{2}/);
  });

  it("prompts to switch to Month view when the agenda window is empty but events exist", () => {
    // Event 100 days in the past is outside the 60-day-from-today window.
    renderThemed(
      <Calendar
        events={[{ id: "p", date: daysFromNow(-100), title: "Past" }]}
        defaultView="agenda"
      />,
    );
    expect(screen.getByText(/No events in the next/i)).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /switch to month view/i });
    fireEvent.click(button);
    // Clicking switches to the month grid.
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("says nothing is scheduled when there are no events at all", () => {
    renderThemed(<Calendar events={[]} defaultView="agenda" />);
    expect(screen.getByText(/nothing on the calendar/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /switch to month view/i })).not.toBeInTheDocument();
  });
});
