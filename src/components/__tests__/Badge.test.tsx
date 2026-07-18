import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Badge } from "../Badge";
import { renderThemed } from "./testUtils";

describe("Badge", () => {
  it("renders its content", () => {
    renderThemed(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
