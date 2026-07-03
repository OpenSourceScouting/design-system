import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
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

  it("has no axe violations across tones", async () => {
    const { container } = renderThemed(
      <div>
        <Alert tone="info" title="Info">
          Info body
        </Alert>
        <Alert tone="warning" title="Warning">
          Warning body
        </Alert>
        <Alert tone="danger" title="Danger">
          Danger body
        </Alert>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
