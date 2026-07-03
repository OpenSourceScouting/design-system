import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ProgramHero } from "../ProgramHero";
import { renderThemed } from "./testUtils";

describe("ProgramHero", () => {
  it("renders the headline and program label (watermark default)", () => {
    renderThemed(
      <ProgramHero
        headline="Adventure awaits"
        lede="Join a pack near you."
        primaryAction={{ label: "Join" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Adventure awaits" })).toBeInTheDocument();
    expect(screen.getByText("Cub Scouts")).toBeInTheDocument();
  });

  it("suppresses the watermark when watermark={false}", () => {
    renderThemed(<ProgramHero headline="No watermark" watermark={false} />);
    expect(screen.getByRole("heading", { name: "No watermark" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderThemed(
      <ProgramHero
        headline="Adventure awaits"
        lede="Join a pack near you."
        primaryAction={{ label: "Join" }}
        secondaryAction={{ label: "Learn more" }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
