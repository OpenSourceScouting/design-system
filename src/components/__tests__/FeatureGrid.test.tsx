import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { FeatureGrid, type Feature } from "../FeatureGrid";
import { renderThemed } from "./testUtils";

const FEATURES: Feature[] = [
  { title: "Adventure", description: "Get outside and explore." },
  { title: "Friendship", description: "Build lifelong bonds." },
  { title: "Growth", description: "Learn skills that last." },
];

describe("FeatureGrid", () => {
  it("renders every feature", () => {
    renderThemed(<FeatureGrid features={FEATURES} />);
    for (const f of FEATURES) {
      expect(screen.getByText(f.title as string)).toBeInTheDocument();
      expect(screen.getByText(f.description as string)).toBeInTheDocument();
    }
  });
});
