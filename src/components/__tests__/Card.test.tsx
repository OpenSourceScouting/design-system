import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Card, CardBody, CardHeader, CardFooter, CardEyebrow } from "../Card";
import { renderThemed } from "./testUtils";

describe("Card", () => {
  it("renders composed children", () => {
    renderThemed(
      <Card>
        <CardHeader>
          <CardEyebrow>Upcoming</CardEyebrow>
        </CardHeader>
        <CardBody>Body copy</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Body copy")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderThemed(
      <Card featured>
        <CardHeader>
          <CardEyebrow>Lead story</CardEyebrow>
        </CardHeader>
        <CardBody>Featured card body content.</CardBody>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
