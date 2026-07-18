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
});
