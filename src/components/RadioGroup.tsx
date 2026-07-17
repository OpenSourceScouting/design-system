import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { cn } from "../lib/utils/cn";

/**
 * RadioGroup + Radio. The group renders a fieldset/legend for correct grouping
 * semantics and manages selection (controlled via `value`/`onValueChange`, or
 * uncontrolled via `defaultValue`). Radios read the group's name/value/handler
 * from context.
 *
 *   <RadioGroup label="Shirt size" defaultValue="m">
 *     <Radio value="s" label="Small" />
 *     <Radio value="m" label="Medium" />
 *   </RadioGroup>
 */

type RadioGroupContextValue = {
  name: string;
  value?: string;
  setValue: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioGroupProps = {
  label?: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function RadioGroup({
  label,
  help,
  error,
  name,
  value,
  defaultValue,
  onValueChange,
  disabled,
  children,
  className,
}: RadioGroupProps) {
  const autoId = useId();
  const groupName = name ?? autoId;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;
  const helpId = help ? `${autoId}-help` : undefined;
  const errorId = error ? `${autoId}-error` : undefined;

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <fieldset
      className={cn("m-0 flex flex-col gap-2 border-0 p-0", className)}
      disabled={disabled}
      aria-describedby={[helpId, errorId].filter(Boolean).join(" ") || undefined}
      aria-invalid={error ? true : undefined}
    >
      {label ? (
        <legend className="display mb-1 p-0 text-sm font-medium text-program-on-surface">
          {label}
        </legend>
      ) : null}
      <RadioGroupContext.Provider value={{ name: groupName, value: current, setValue, disabled }}>
        <div className="flex flex-col gap-2">{children}</div>
      </RadioGroupContext.Provider>
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
    </fieldset>
  );
}

export type RadioProps = {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function Radio({ value, label, description, disabled, id, className }: RadioProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("Radio must be rendered inside a RadioGroup.");
  }
  const autoId = useId();
  const rid = id ?? autoId;
  const isDisabled = disabled || ctx.disabled;

  return (
    <label
      htmlFor={rid}
      className={cn(
        "flex items-start gap-2 text-sm text-program-on-surface",
        isDisabled && "opacity-50",
        className,
      )}
    >
      <input
        type="radio"
        id={rid}
        name={ctx.name}
        value={value}
        checked={ctx.value === value}
        disabled={isDisabled}
        onChange={() => ctx.setValue(value)}
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 accent-program-primary",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring",
        )}
      />
      <span>
        {label}
        {description ? (
          <span className="block text-xs text-program-on-surface-soft">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
