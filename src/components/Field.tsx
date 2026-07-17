import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "../lib/utils/cn";

/**
 * Field is the foundation of the form layer. It renders a label, the control,
 * optional help text, and an error message, and wires them together for
 * accessibility: the control gets a stable `id`, `aria-describedby` pointing at
 * the help/error text, and `aria-invalid` when an error is present.
 *
 * Text-like controls (TextInput, Textarea, Select, Checkbox, Switch) read this
 * wiring from context automatically when rendered inside a Field, so you rarely
 * pass ids by hand:
 *
 *   <Field label="Email" help="We never share it." error={errors.email}>
 *     <TextInput type="email" name="email" />
 *   </Field>
 *
 * Radio groups use `RadioGroup` instead (fieldset/legend grouping), not Field.
 */

type FieldContextValue = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/** Read the enclosing Field's a11y wiring. Returns null outside a Field. */
export function useFieldContext() {
  return useContext(FieldContext);
}

/** Shared control styling for the text-like inputs (TextInput, Textarea, Select). */
export function controlClasses(invalid?: boolean) {
  return cn(
    "w-full rounded-program border bg-program-surface px-3 py-2 text-sm text-program-on-surface",
    "placeholder:text-program-on-surface-faint",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring",
    "disabled:opacity-50 disabled:pointer-events-none",
    invalid ? "border-sa-red" : "border-program-border",
  );
}

export type FieldProps = {
  label?: ReactNode;
  /** Override the generated control id (rarely needed). */
  htmlFor?: string;
  help?: ReactNode;
  /** Presence marks the field invalid and renders the message with role="alert". */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({
  label,
  htmlFor,
  help,
  error,
  required = false,
  disabled = false,
  children,
  className,
}: FieldProps) {
  const autoId = useId();
  const id = htmlFor ?? autoId;
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), required, disabled }}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label ? (
          <label htmlFor={id} className="display text-sm font-medium text-program-on-surface">
            {label}
            {required ? (
              <span className="text-sa-red" aria-hidden>
                {" "}
                *
              </span>
            ) : null}
          </label>
        ) : null}
        {children}
        {help ? (
          <p id={helpId} className="text-xs text-program-on-surface-soft">
            {help}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-sa-red">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
