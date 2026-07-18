import * as React from "react";
import { Tooltip as T } from "radix-ui";
import { useProgramStamp } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

/**
 * Tooltip (shadcn recipe on Radix, our tokens). Wrap the app (or a subtree) in
 * TooltipProvider once. Portalled content re-stamps data-program (delta 9).
 *
 * The tooltip fills with the program primary (a small, high-contrast chip),
 * which reads as an intentional brand cue rather than a neutral popover.
 */
export const TooltipProvider = T.Provider;
export const Tooltip = T.Root;
export const TooltipTrigger = T.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof T.Content>,
  React.ComponentPropsWithoutRef<typeof T.Content>
>(function TooltipContent({ className, sideOffset = 4, ...props }, ref) {
  const stamp = useProgramStamp();
  return (
    <T.Portal>
      <T.Content
        ref={ref}
        {...stamp}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-xs rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-lg",
          className,
        )}
        {...props}
      />
    </T.Portal>
  );
});
