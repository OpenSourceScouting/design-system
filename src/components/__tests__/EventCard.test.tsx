import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { EventCard } from "../EventCard";
import { renderThemed } from "./testUtils";

const DATE = new Date(2026, 8, 12, 9, 30); // Sep 12, 2026, 9:30am (local)

describe("EventCard", () => {
  it("renders the built-in date block and title", () => {
    renderThemed(<EventCard date={DATE} title="Fall Camporee" location="Camp Alpine" />);
    expect(screen.getByText("Fall Camporee")).toBeInTheDocument();
    expect(screen.getByText("SEP")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Camp Alpine")).toBeInTheDocument();
  });

  it("uses a renderDateBlock override when provided", () => {
    renderThemed(
      <EventCard
        date={DATE}
        endDate={new Date(2026, 8, 14, 12, 0)}
        title="Fall Camporee"
        renderDateBlock={(start, end) => (
          <div data-testid="custom-date">
            {start.getDate()}
            {end ? `-${end.getDate()}` : ""}
          </div>
        )}
      />,
    );
    const block = screen.getByTestId("custom-date");
    expect(block).toHaveTextContent("12-14");
    // The built-in month label must NOT render when overridden.
    expect(screen.queryByText("SEP")).not.toBeInTheDocument();
  });
});
