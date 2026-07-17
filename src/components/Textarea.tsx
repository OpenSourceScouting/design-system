import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../lib/utils/cn";
import { useFieldContext, controlClasses } from "./Field";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Force the invalid style. Inferred from an enclosing Field otherwise. */
  invalid?: boolean;
};

/** Multi-line text input. Inherits Field wiring like TextInput. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, id, required, disabled, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  return (
    <textarea
      ref={ref}
      id={id ?? field?.id}
      aria-invalid={isInvalid || undefined}
      aria-describedby={describedBy ?? field?.describedBy}
      required={required ?? field?.required}
      disabled={disabled ?? field?.disabled}
      className={cn(controlClasses(isInvalid), "min-h-[6rem] leading-relaxed", className)}
      {...rest}
    />
  );
});
