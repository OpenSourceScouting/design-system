import { forwardRef, useId, useState, type ReactNode } from "react";
import { cn } from "../lib/utils/cn";
import { useFieldContext } from "./Field";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Label rendered beside the switch. */
  label?: ReactNode;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
};

/**
 * An on/off toggle implemented as a `role="switch"` button (works with keyboard
 * and screen readers out of the box). Controlled via `checked`/`onCheckedChange`
 * or uncontrolled via `defaultChecked`.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked, onCheckedChange, disabled, label, id, name, value, className },
  ref,
) {
  const autoId = useId();
  const field = useFieldContext();
  const sid = id ?? field?.id ?? autoId;
  const isDisabled = disabled ?? field?.disabled;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (isDisabled) return;
    if (!isControlled) setInternal(!on);
    onCheckedChange?.(!on);
  };

  const button = (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      id={sid}
      name={name}
      value={value}
      disabled={isDisabled}
      onClick={toggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:opacity-50 disabled:pointer-events-none",
        on ? "bg-primary" : "bg-border",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-background shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );

  if (!label) return button;

  return (
    <span className={cn("inline-flex items-center gap-2", isDisabled && "opacity-50")}>
      {button}
      <label htmlFor={sid} className="text-sm text-foreground">
        {label}
      </label>
    </span>
  );
});
