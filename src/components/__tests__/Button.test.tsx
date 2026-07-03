import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "../Button";
import { renderThemed } from "./testUtils";

describe("Button", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders its label", () => {
    renderThemed(<Button>Sign up</Button>);
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderThemed(<Button>Sign up</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("warns in dev when variant=accent and size=sm (untyped call site)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // Cast to bypass the discriminated-union type guard: this simulates an
    // untyped JS call site the runtime warning is meant to catch.
    const props = { variant: "accent", size: "sm" } as unknown as Parameters<typeof Button>[0];
    renderThemed(<Button {...props}>Register</Button>);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toMatch(/accent.*sm|WCAG AA/i);
  });

  it("does not warn for the allowed accent+md combination", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderThemed(
      <Button variant="accent" size="md">
        Register
      </Button>,
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
