import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderThemed } from "./testUtils";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../Dialog";

describe("Dialog", () => {
  it("renders as a dialog when open", () => {
    renderThemed(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
            <DialogDescription>Confirm your attendance.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
