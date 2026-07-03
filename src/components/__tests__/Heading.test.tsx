import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Heading } from "../Heading";
import { renderThemed } from "./testUtils";

describe("Heading", () => {
  it("renders the semantic level requested", () => {
    renderThemed(<Heading level={1}>Adventure awaits</Heading>);
    const h = screen.getByRole("heading", { level: 1, name: "Adventure awaits" });
    expect(h).toBeInTheDocument();
  });

  it("decouples visual size from semantic level", () => {
    renderThemed(
      <Heading level={2} size={1}>
        Big look, h2 semantics
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderThemed(<Heading level={2}>Section title</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
