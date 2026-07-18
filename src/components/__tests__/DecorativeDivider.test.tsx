import { describe, it, expect } from "vitest";
import { DecorativeDivider, type MotifName } from "../DecorativeDivider";
import { renderThemed } from "./testUtils";

const MOTIFS: MotifName[] = ["diamonds", "rule", "chevrons", "wave"];

describe("DecorativeDivider", () => {
  it("renders an aria-hidden svg by default (program-derived motif)", () => {
    const { container } = renderThemed(<DecorativeDivider />);
    const wrapper = container.querySelector("[aria-hidden]");
    expect(wrapper).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders each motif via the motif override", () => {
    for (const motif of MOTIFS) {
      const { container } = renderThemed(<DecorativeDivider motif={motif} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    }
  });
});
