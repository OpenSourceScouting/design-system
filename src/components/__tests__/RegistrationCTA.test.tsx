import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { RegistrationCTA } from "../RegistrationCTA";
import { renderThemed } from "./testUtils";

describe("RegistrationCTA", () => {
  it("falls back to program-derived headline and body", () => {
    renderThemed(<RegistrationCTA />);
    expect(screen.getByRole("heading", { name: /Ready to join Cub Scouts/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Find a Unit Near You" })).toBeInTheDocument();
  });

  it("renders custom headline/body/label", () => {
    renderThemed(
      <RegistrationCTA
        headline="Sign up today"
        body="Spots are filling fast."
        primaryLabel="Enroll"
      />,
    );
    expect(screen.getByRole("heading", { name: "Sign up today" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enroll" })).toBeInTheDocument();
  });
});
