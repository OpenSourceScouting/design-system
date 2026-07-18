import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils/cn";

/**
 * Badge recipe (shadcn cva idiom, our variants + tokens). `accent` fills with
 * the BRAND accent (bg-os-accent), not the muted --accent wash (delta 4).
 */
const badgeVariants = cva(
  "display inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] uppercase tracking-wider",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        accent: "bg-os-accent text-os-accent-foreground",
        subtle: "bg-secondary text-secondary-foreground",
        outline: "border border-primary bg-transparent text-primary",
      },
    },
    defaultVariants: { variant: "subtle" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...rest}>
      {children}
    </span>
  );
}

export { badgeVariants };
