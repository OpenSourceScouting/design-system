import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils/cn";

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
 * (Delta 5. cva's VariantProps cannot express this exclusion, so the public
 * type stays a discriminated union on top of the cva recipe.)
 */
export type ButtonProps = ButtonBaseProps &
  (
    | { variant?: Exclude<ButtonVariant, "accent">; size?: ButtonSize }
    | { variant: "accent"; size?: Exclude<ButtonSize, "sm"> }
  );

/**
 * Button recipe (shadcn cva idiom, our variants + tokens). Colors resolve to the
 * shadcn semantic tokens so a data-program change re-themes with no edits.
 * Note the accent variant fills with bg-os-accent (the BRAND accent), NOT
 * bg-accent (which is the muted hover wash, per delta 4).
 */
const buttonVariants = cva(
  "display inline-flex items-center justify-center gap-2 select-none whitespace-nowrap " +
    "transition-[transform,box-shadow,background-color,color] duration-program-fast ease-program " +
    "motion-safe:active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-lg",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-program hover:bg-primary/90 hover:shadow-md",
        secondary:
          "bg-background text-primary border-2 border-primary " +
          "hover:bg-primary hover:text-primary-foreground",
        ghost: "bg-transparent text-primary hover:bg-muted",
        accent:
          "bg-os-accent text-os-accent-foreground shadow-program hover:brightness-95 hover:shadow-md",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    block,
    className,
    children,
    type = "button",
    ...rest
  }: ButtonBaseProps & { variant?: ButtonVariant; size?: ButtonSize },
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
      className={cn(buttonVariants({ variant, size }), block && "w-full", className)}
      {...rest}
    >
      {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
    </button>
  );
});

export { buttonVariants };
