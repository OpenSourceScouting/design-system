import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Alert } from "../Alert";
import { renderThemed } from "./testUtils";

describe("Alert", () => {
  it("renders title and body with a status role", () => {
    renderThemed(
      <Alert tone="success" title="Registered">
        Your spot is confirmed.
      </Alert>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Registered")).toBeInTheDocument();
    expect(screen.getByText("Your spot is confirmed.")).toBeInTheDocument();
  });
});
