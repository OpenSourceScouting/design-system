import * as React from "react";
import { Accordion as A } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { Icon } from "./Icon";
import { cn } from "../lib/utils/cn";

/**
 * Accordion (shadcn recipe on Radix, our tokens). Not portalled. The chevron
 * rotates on open. Height animation is omitted intentionally (no animation
 * library dependency); Radix still exposes --radix-accordion-content-height for
 * consumers who want to add it.
 */
export const Accordion = A.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof A.Item>,
  React.ComponentPropsWithoutRef<typeof A.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return <A.Item ref={ref} className={cn("border-b border-border", className)} {...props} />;
});

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof A.Trigger>,
  React.ComponentPropsWithoutRef<typeof A.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <A.Header className="flex">
      <A.Trigger
        ref={ref}
        className={cn(
          "font-display flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all",
          "hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "[&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <Icon
          icon={ChevronDown}
          size={16}
          className="shrink-0 text-muted-foreground transition-transform duration-200"
        />
      </A.Trigger>
    </A.Header>
  );
});

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof A.Content>,
  React.ComponentPropsWithoutRef<typeof A.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <A.Content ref={ref} className={cn("overflow-hidden text-sm", className)} {...props}>
      <div className="pb-4 pt-0 text-foreground/85">{children}</div>
    </A.Content>
  );
});
