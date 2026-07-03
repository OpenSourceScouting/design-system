import { describe, it, expect, beforeAll } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { EventDialog } from "../EventDialog";
import type { CalendarEvent } from "../Calendar";
import { renderThemed } from "./testUtils";

/**
 * jsdom implements <dialog> markup but not the modal behavior: showModal(),
 * close(), and the `open` reflected property are missing, so the component's
 * effect throws. Stub them minimally: showModal/show set open=true, close sets
 * open=false and dispatches the native "close" event the component listens for.
 */
beforeAll(() => {
  const proto = window.HTMLDialogElement?.prototype ?? HTMLDialogElement.prototype;
  if (!proto.showModal) {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
  }
  if (!proto.show) {
    proto.show = function show(this: HTMLDialogElement) {
      this.open = true;
    };
  }
  if (!proto.close) {
    proto.close = function close(this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  }
});

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

  it("renders a closed placeholder dialog when event is null", () => {
    const { container } = renderThemed(<EventDialog event={null} onClose={() => {}} />);
    expect(container.querySelector("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Fall Camporee" })).not.toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    const { container } = renderThemed(<EventDialog event={EVENT} onClose={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
