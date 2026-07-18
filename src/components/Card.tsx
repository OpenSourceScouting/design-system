import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Visual weight. `flat` is the lightest, `elevated` floats with shadow. */
  variant?: "flat" | "outlined" | "elevated";
  /**
   * When true, promotes the card to a featured state: applies the program
   * shadow (shadow-program) and an inset hairline ring (ring-1 ring-inset
   * ring-border/60) on top of the base variant styles. The effect reads as
   * tonal depth, not a directional accent bar. Pair with CardEyebrow or a
   * DecorativeDivider motif for the strongest "lead story" treatment.
   */
  featured?: boolean;
};

const cardVariants = cva("overflow-hidden rounded-lg", {
  variants: {
    variant: {
      flat: "bg-muted/40",
      outlined: "bg-card border border-border/60",
      elevated: "bg-card shadow-program border border-border/30",
    },
  },
  defaultVariants: { variant: "outlined" },
});

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "outlined", featured, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant }),
        featured && "bg-card shadow-program ring-1 ring-inset ring-border/60",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export { cardVariants };

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("border-b border-border/40 px-5 pb-3 pt-5 sm:px-6 sm:pt-6", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("border-t border-border/40 bg-muted/40 px-5 py-3 sm:px-6", className)}>
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
    <div className={cn("mb-3 flex items-baseline border-b-rule border-border/60 pb-2", className)}>
      <span className="display text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}
