import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { DecorativeBorder, type MotifName } from "../DecorativeBorder";
import { renderThemed } from "./testUtils";

const MOTIFS: MotifName[] = ["diamonds", "rule", "chevrons", "wave"];

describe("DecorativeBorder", () => {
  it("renders an aria-hidden svg by default (program-derived motif)", () => {
    const { container } = renderThemed(<DecorativeBorder />);
    const wrapper = container.querySelector("[aria-hidden]");
    expect(wrapper).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders each motif via the motif override", () => {
    for (const motif of MOTIFS) {
      const { container } = renderThemed(<DecorativeBorder motif={motif} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    }
  });

  it("has no axe violations for every motif", async () => {
    const { container } = renderThemed(
      <div>
        {MOTIFS.map((m) => (
          <DecorativeBorder key={m} motif={m} />
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
