import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Visual weight. `flat` is the lightest, `elevated` floats with shadow. */
  variant?: "flat" | "outlined" | "elevated";
  /**
   * When true, promotes the card to a featured state: applies the program
   * shadow (shadow-program) and an inset hairline ring (ring-1 ring-inset
   * ring-program-border/60) on top of the base variant styles. The effect
   * reads as tonal depth, not a directional accent bar. Pair with CardEyebrow
   * or a DecorativeDivider motif for the strongest "lead story" treatment.
   */
  featured?: boolean;
};

const VARIANT: Record<NonNullable<CardProps["variant"]>, string> = {
  flat: "bg-program-surface-muted/40",
  outlined: "bg-program-surface border border-program-border/60",
  elevated: "bg-program-surface shadow-program border border-program-border/30",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "outlined", featured, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-program overflow-hidden",
        VARIANT[variant],
        featured && "bg-program-surface shadow-program ring-1 ring-inset ring-program-border/60",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn("px-5 pt-5 pb-3 sm:px-6 sm:pt-6 border-b border-program-border/40", className)}
    >
      {children}
    </div>
  );
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "px-5 py-3 sm:px-6 bg-program-surface-muted/40 border-t border-program-border/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Editorial kicker: a short uppercase label riding a full-width bottom
 * keyline. Replaces the old pill/badge eyebrow pattern. The keyline weight
 * and the label voice both vary per program via CSS vars (Cub reads heavy
 * and chunky, Sea Scouts light and italic) with zero branching.
 */
export function CardEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-baseline border-b-rule border-program-border/60 pb-2 mb-3",
        className,
      )}
    >
      <span className="display text-[11px] uppercase tracking-[0.18em] text-program-on-surface-soft">
        {children}
      </span>
    </div>
  );
}
