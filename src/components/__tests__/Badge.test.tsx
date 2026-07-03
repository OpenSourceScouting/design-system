import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Badge } from "../Badge";
import { renderThemed } from "./testUtils";

describe("Badge", () => {
  it("renders its content", () => {
    renderThemed(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("has no axe violations across variants", async () => {
    const { container } = renderThemed(
      <div>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="accent">Accent</Badge>
        <Badge variant="subtle">Subtle</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
