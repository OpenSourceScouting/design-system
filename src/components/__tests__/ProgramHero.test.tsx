import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { ProgramHero } from "../ProgramHero";
import { renderThemed } from "./testUtils";

describe("ProgramHero", () => {
  it("renders the headline", () => {
    renderThemed(
      <ProgramHero
        headline="Adventure awaits"
        lede="Join a pack near you."
        primaryAction={{ label: "Join" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Adventure awaits" })).toBeInTheDocument();
  });

  it("hides the program identity block by default (DS-1)", () => {
    renderThemed(<ProgramHero headline="Adventure awaits" primaryAction={{ label: "Join" }} />);
    expect(screen.queryByText("Cub Scouts")).not.toBeInTheDocument();
  });

  it("shows the program identity block when opted in", () => {
    renderThemed(
      <ProgramHero
        headline="Adventure awaits"
        showProgramIdentity
        primaryAction={{ label: "Join" }}
      />,
    );
    expect(screen.getByText("Cub Scouts")).toBeInTheDocument();
  });

  it("does not inject the program tagline by default (DS-3)", () => {
    renderThemed(<ProgramHero headline="Adventure awaits" />);
    // The Cub Scouts tagline from PROGRAM_META should not appear unopted.
    expect(screen.queryByText("Do Your Best. Have Fun Doing It.")).not.toBeInTheDocument();
  });

  it("injects the program tagline when opted in (DS-3)", () => {
    renderThemed(<ProgramHero headline="Adventure awaits" showTagline />);
    expect(screen.getByText("Do Your Best. Have Fun Doing It.")).toBeInTheDocument();
  });

  it("renders an action as an anchor when href is given (DS-2)", () => {
    renderThemed(
      <ProgramHero
        headline="Adventure awaits"
        primaryAction={{ label: "Find a Unit", href: "/find" }}
      />,
    );
    const link = screen.getByRole("link", { name: "Find a Unit" });
    expect(link).toHaveAttribute("href", "/find");
  });

  it("renders an action as a button when only onClick is given (DS-2)", () => {
    renderThemed(
      <ProgramHero
        headline="Adventure awaits"
        primaryAction={{ label: "Join", onClick: () => {} }}
      />,
    );
    expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
  });

  it("suppresses the watermark when watermark={false}", () => {
    renderThemed(<ProgramHero headline="No watermark" watermark={false} />);
    expect(screen.getByRole("heading", { name: "No watermark" })).toBeInTheDocument();
  });
});
