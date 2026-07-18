import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { EventDialog, EventDialogHeader } from "../EventDialog";
import type { CalendarEvent } from "../Calendar";
import { renderThemed } from "./testUtils";

// EventDialog is built on the Radix Dialog recipe. Radix portals the content to
// document.body, so open-dialog assertions query the whole document (screen)
// and the axe pass targets document.body, not the render container.

const EVENT: CalendarEvent = {
  id: "e1",
  date: new Date(2026, 8, 12, 9, 0),
  endDate: new Date(2026, 8, 12, 15, 0),
  title: "Fall Camporee",
  category: "Camporee",
  location: "Camp Alpine",
  description: "A weekend of outdoor skills.",
  registrationUrl: "https://example.org/register",
};

describe("EventDialog", () => {
  it("renders event details when open", () => {
    renderThemed(<EventDialog event={EVENT} onClose={() => {}} />);
    expect(screen.getByRole("heading", { name: "Fall Camporee" })).toBeInTheDocument();
    expect(screen.getByText("Camp Alpine")).toBeInTheDocument();
    // Default Register action from registrationUrl.
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("renders nothing when event is null (dialog closed)", () => {
    renderThemed(<EventDialog event={null} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Fall Camporee" })).not.toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    renderThemed(<EventDialog event={EVENT} onClose={() => {}} />);
    // Radix portals the dialog to document.body, outside the render container.
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

describe("EventDialogHeader date range formatting", () => {
  function makeEvent(overrides: Partial<CalendarEvent>): CalendarEvent {
    return { id: "x", title: "Test Event", date: new Date(2026, 6, 19, 9, 0), ...overrides };
  }

  it("single-day event: renders full date with year and no dash", () => {
    const event = makeEvent({ date: new Date(2026, 6, 19, 9, 0) });
    renderThemed(<EventDialogHeader event={event} onClose={() => {}} />);
    expect(screen.getByText(/Sunday, July 19, 2026/)).toBeInTheDocument();
  });

  it("same-month range (Jul 19-21 2026): both sides carry month, year only at end", () => {
    const event = makeEvent({
      date: new Date(2026, 6, 19, 9, 0),
      endDate: new Date(2026, 6, 21, 15, 0),
    });
    renderThemed(<EventDialogHeader event={event} onClose={() => {}} />);
    expect(screen.getByText(/Sunday, July 19 - Tuesday, July 21, 2026/)).toBeInTheDocument();
  });

  it("cross-month range (Jul 28 - Aug 2 2026): both sides carry their own month and year", () => {
    const event = makeEvent({
      date: new Date(2026, 6, 28, 9, 0),
      endDate: new Date(2026, 7, 2, 15, 0),
    });
    renderThemed(<EventDialogHeader event={event} onClose={() => {}} />);
    expect(screen.getByText(/Tuesday, July 28, 2026 - Sunday, August 2, 2026/)).toBeInTheDocument();
  });

  it("cross-year range (Dec 30 2026 - Jan 2 2027): both sides carry their own month and year", () => {
    const event = makeEvent({
      date: new Date(2026, 11, 30, 9, 0),
      endDate: new Date(2027, 0, 2, 15, 0),
    });
    renderThemed(<EventDialogHeader event={event} onClose={() => {}} />);
    expect(
      screen.getByText(/Wednesday, December 30, 2026 - Saturday, January 2, 2027/),
    ).toBeInTheDocument();
  });
});
