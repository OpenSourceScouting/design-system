import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils/cn";
import { useFieldContext } from "./Field";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Label rendered beside the box. Omit to render a bare checkbox. */
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
};

/**
 * A single checkbox with an optional label to its right (the correct layout for
 * checkboxes, unlike Field's label-above pattern). Uses the native accent color
 * so it themes with the active program.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    invalid,
    id,
    className,
    disabled,
    "aria-describedby": describedBy,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const field = useFieldContext();
  const cid = id ?? field?.id ?? autoId;
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled;

  const box = (
    <input
      ref={ref}
      type="checkbox"
      id={cid}
      disabled={isDisabled}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy ?? field?.describedBy}
      className={cn(
        "mt-0.5 h-4 w-4 shrink-0 accent-program-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring",
        className,
      )}
      {...rest}
    />
  );

  if (!label) return box;

  return (
    <label
      htmlFor={cid}
      className={cn(
        "flex items-start gap-2 text-sm text-program-on-surface",
        isDisabled && "opacity-50",
      )}
    >
      {box}
      <span>
        {label}
        {description ? (
          <span className="block text-xs text-program-on-surface-soft">{description}</span>
        ) : null}
      </span>
    </label>
  );
});
