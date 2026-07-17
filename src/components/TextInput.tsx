import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/utils/cn";
import { useFieldContext, controlClasses } from "./Field";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Force the invalid style. Inferred from an enclosing Field otherwise. */
  invalid?: boolean;
};

/**
 * Single-line text input. Inside a Field it inherits the field's id,
 * aria-describedby, aria-invalid, required, and disabled automatically.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, invalid, id, required, disabled, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  return (
    <input
      ref={ref}
      id={id ?? field?.id}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy ?? field?.describedBy}
      required={required ?? field?.required}
      disabled={disabled ?? field?.disabled}
      className={cn(controlClasses(isInvalid), "h-11", className)}
      {...rest}
    />
  );
});
