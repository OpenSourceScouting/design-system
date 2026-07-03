import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils/cn";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "primary" | "accent" | "subtle" | "outline";
};

const VARIANT: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary: "bg-program-primary text-program-on-primary",
  accent: "bg-program-accent text-program-on-accent",
  subtle: "bg-program-surface-muted text-program-on-surface-muted",
  outline: "bg-transparent text-program-primary border border-program-primary",
};

export function Badge({ variant = "subtle", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "display inline-flex items-center gap-1 px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-program",
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
