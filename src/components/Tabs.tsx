import * as React from "react";
import { Tabs as T } from "radix-ui";
import { cn } from "../lib/utils/cn";

/**
 * Tabs (shadcn recipe on Radix, our tokens). Not portalled, so no data-program
 * re-stamp is needed. Triggers use the display font (UI chrome), the active tab
 * lifts to bg-background out of the muted track.
 */
export const Tabs = T.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof T.List>,
  React.ComponentPropsWithoutRef<typeof T.List>
>(function TabsList({ className, ...props }, ref) {
  return (
    <T.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof T.Trigger>,
  React.ComponentPropsWithoutRef<typeof T.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <T.Trigger
      ref={ref}
      className={cn(
        "font-display inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
});

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof T.Content>,
  React.ComponentPropsWithoutRef<typeof T.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <T.Content
      ref={ref}
      className={cn(
        "mt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
});
