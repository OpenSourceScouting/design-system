import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { ProgramMark } from "../ProgramMark";
import { renderThemed } from "./testUtils";

describe("ProgramMark", () => {
  it("renders the placeholder mark with an accessible label when forced", () => {
    renderThemed(<ProgramMark forcePlaceholder />);
    // Placeholder renders as role=img with a program-labelled placeholder name.
    const img = screen.getByRole("img", { name: /Cub Scouts placeholder mark/i });
    expect(img).toBeInTheDocument();
  });

  it("probes svg first by default", () => {
    renderThemed(<ProgramMark />);
    expect(screen.getByRole("img", { name: /Cub Scouts mark/i })).toHaveAttribute(
      "src",
      "/marks/cub.svg",
    );
  });

  it("tries preferExtension first, bypassing the default svg", () => {
    renderThemed(<ProgramMark preferExtension="png" />);
    expect(screen.getByRole("img", { name: /Cub Scouts mark/i })).toHaveAttribute(
      "src",
      "/marks/cub.png",
    );
  });

  it("renders an explicit src verbatim and does not probe (basePath ignored)", () => {
    renderThemed(<ProgramMark src="https://cdn.example.org/x/cub-brand.svg" basePath="/other/" />);
    expect(screen.getByRole("img", { name: /Cub Scouts mark/i })).toHaveAttribute(
      "src",
      "https://cdn.example.org/x/cub-brand.svg",
    );
  });
});
