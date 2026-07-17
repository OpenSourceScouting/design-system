import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderThemed } from "./testUtils";
import { Field } from "../Field";
import { TextInput } from "../TextInput";
import { Textarea } from "../Textarea";
import { NativeSelect } from "../NativeSelect";
import { Checkbox } from "../Checkbox";
import { Switch } from "../Switch";
import { RadioGroup, Radio } from "../RadioGroup";

describe("Field wiring", () => {
  it("associates the label with the control and exposes help via aria-describedby", () => {
    renderThemed(
      <Field label="Email" help="No spam, ever.">
        <TextInput type="email" />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent("No spam, ever.");
  });

  it("marks the control invalid and renders the error with role=alert", () => {
    renderThemed(
      <Field label="Email" error="Required.">
        <TextInput type="email" />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required.");
  });
});

describe("Switch", () => {
  it("toggles aria-checked and fires onCheckedChange (uncontrolled)", () => {
    const calls: boolean[] = [];
    renderThemed(<Switch label="Reminders" onCheckedChange={(v) => calls.push(v)} />);
    const sw = screen.getByRole("switch", { name: "Reminders" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    fireEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(calls).toEqual([true]);
  });
});

describe("RadioGroup", () => {
  it("selects a radio on click (uncontrolled)", () => {
    renderThemed(
      <RadioGroup label="Size" defaultValue="s">
        <Radio value="s" label="Small" />
        <Radio value="m" label="Medium" />
      </RadioGroup>,
    );
    const small = screen.getByLabelText("Small") as HTMLInputElement;
    const medium = screen.getByLabelText("Medium") as HTMLInputElement;
    expect(small.checked).toBe(true);
    fireEvent.click(medium);
    expect(medium.checked).toBe(true);
    expect(small.checked).toBe(false);
  });
});

describe("forms accessibility", () => {
  it("has no axe violations for a composed form", async () => {
    const { container } = renderThemed(
      <form>
        <Field label="Name" help="Your full name.">
          <TextInput />
        </Field>
        <Field label="Bio">
          <Textarea />
        </Field>
        <Field label="Program">
          <NativeSelect>
            <option value="cub">Cub Scouts</option>
          </NativeSelect>
        </Field>
        <Checkbox label="I agree to the health policy" />
        <Switch label="Email reminders" />
        <RadioGroup label="Shirt size" defaultValue="s">
          <Radio value="s" label="Small" />
          <Radio value="m" label="Medium" />
        </RadioGroup>
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
