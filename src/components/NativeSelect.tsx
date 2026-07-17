import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils/cn";
import { useFieldContext, controlClasses } from "./Field";
import { Icon } from "./Icon";

export type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** Force the invalid style. Inferred from an enclosing Field otherwise. */
  invalid?: boolean;
};

/**
 * Styled native <select>. A native control is intentional: it is fully
 * accessible, works on mobile, and needs no JS. Pass <option> children.
 *
 * Theming caveat: only the CLOSED control is styled by our CSS. The OPEN option
 * list is painted by the operating system, so it cannot take the program's
 * surface tint (macOS ignores `option` background entirely; Windows/Linux and
 * Firefox honor it more). We pin `color-scheme: light` here so the native popup
 * always renders light to match the (always-light) program surfaces, rather
 * than inheriting a dark system popup on a dark page. For a fully theme-matched
 * dropdown use the themed `Select` (built on Radix). This native control stays
 * as the accessible, zero-JS, mobile-friendly escape hatch.
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  {
    className,
    invalid,
    id,
    required,
    disabled,
    "aria-describedby": describedBy,
    children,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  return (
    <div className="relative">
      <select
        ref={ref}
        id={id ?? field?.id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy ?? field?.describedBy}
        required={required ?? field?.required}
        disabled={disabled ?? field?.disabled}
        className={cn(
          controlClasses(isInvalid),
          "h-11 appearance-none pr-9 [color-scheme:light]",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <Icon
        icon={ChevronDown}
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-program-on-surface-soft"
      />
    </div>
  );
});
