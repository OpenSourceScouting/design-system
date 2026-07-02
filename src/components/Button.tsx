import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Stretches the button to fill its container. */
  block?: boolean;
};

/**
 * The accent fill (gold/yellow in every program) only passes WCAG AA with its
 * dark text at 16px and up. size="sm" sets 12px text, so the combination is
 * excluded at the type level; a dev-mode warning catches untyped call sites.
 */
export type ButtonProps = ButtonBaseProps &
  (
    | { variant?: Exclude<ButtonVariant, "accent">; size?: ButtonSize }
    | { variant: "accent"; size?: Exclude<ButtonSize, "sm"> }
  );

const BASE =
  "display inline-flex items-center justify-center gap-2 select-none whitespace-nowrap " +
  "transition-[transform,box-shadow,background-color,color] duration-150 " +
  "motion-safe:active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring " +
  "rounded-program";

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-program-primary text-program-on-primary shadow-program " +
    "hover:bg-program-primary/90 hover:shadow-md",
  secondary:
    "bg-program-surface text-program-primary border-2 border-program-primary " +
    "hover:bg-program-primary hover:text-program-on-primary",
  ghost:
    "bg-transparent text-program-primary " +
    "hover:bg-program-surface-muted",
  accent:
    "bg-program-accent text-program-on-accent shadow-program " +
    "hover:brightness-95 hover:shadow-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", leadingIcon, trailingIcon, block, className, children, type = "button", ...rest }: ButtonBaseProps & { variant?: ButtonVariant; size?: ButtonSize },
  ref,
) {
  if (import.meta.env?.DEV && variant === "accent" && size === "sm") {
    console.warn(
      'Button: variant="accent" with size="sm" fails WCAG AA (12px text on the gold fill). Use size="md" or larger, or another variant.',
    );
  }
  return (
    <button
      ref={ref}
      type={type}
      className={cn(BASE, SIZE[size], VARIANT[variant], block && "w-full", className)}
      {...rest}
    >
      {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
    </button>
  );
});
