import { forwardRef, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select as RS } from "radix-ui";
import { useScoutTheme } from "../lib/theme/ScoutThemeProvider";
import { useFieldContext, controlClasses } from "./Field";
import { Icon } from "./Icon";
import { cn } from "../lib/utils/cn";

/**
 * Themed Select: a custom listbox built on Radix Select, so the open option
 * list wears the program's surface tint (unlike the native `NativeSelect`,
 * whose popup is OS-rendered). Pass `SelectItem` children.
 *
 *   <Select defaultValue="cub" onValueChange={setProgram}>
 *     <SelectItem value="cub">Cub Scouts</SelectItem>
 *   </Select>
 *
 * Requires a ScoutThemeProvider ancestor: the dropdown is portalled to
 * document.body (outside the themed subtree), so we re-stamp `data-program` on
 * the portalled content to keep the program tokens resolving. Inherits Field
 * wiring (id / aria-describedby / aria-invalid) when used inside a Field.
 */
export type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  /** `SelectItem` elements. */
  children: ReactNode;
  "aria-label"?: string;
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    value,
    defaultValue,
    onValueChange,
    placeholder = "Select…",
    disabled,
    invalid,
    id,
    name,
    required,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { program } = useScoutTheme();
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <RS.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled ?? field?.disabled}
      name={name}
      required={required ?? field?.required}
    >
      <RS.Trigger
        ref={ref}
        id={id ?? field?.id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        className={cn(
          controlClasses(isInvalid),
          "flex h-11 items-center justify-between gap-2 text-left",
          className,
        )}
        {...rest}
      >
        <RS.Value placeholder={placeholder} />
        <RS.Icon className="text-program-on-surface-soft">
          <ChevronDown size={18} />
        </RS.Icon>
      </RS.Trigger>
      <RS.Portal>
        <RS.Content
          data-program={program}
          position="popper"
          sideOffset={4}
          className={cn(
            "z-50 overflow-hidden rounded-program border border-program-border bg-program-surface text-program-on-surface shadow-program",
            "max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          <RS.Viewport className="p-1">{children}</RS.Viewport>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  );
});

export type SelectItemProps = {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { value, children, disabled, className },
  ref,
) {
  return (
    <RS.Item
      ref={ref}
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-program py-2 pl-8 pr-3 text-sm text-program-on-surface outline-none",
        "data-[highlighted]:bg-program-surface-muted",
        "data-[state=checked]:font-medium",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
    >
      <RS.ItemIndicator className="absolute left-2 inline-flex">
        <Icon icon={Check} size={16} className="text-program-primary" />
      </RS.ItemIndicator>
      <RS.ItemText>{children}</RS.ItemText>
    </RS.Item>
  );
});
