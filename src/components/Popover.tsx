import * as React from "react";
import { Popover as P } from "radix-ui";
import { useProgramStamp } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

/**
 * Popover (shadcn recipe on Radix, our tokens). Portalled content re-stamps
 * data-program (delta 9).
 */
export const Popover = P.Root;
export const PopoverTrigger = P.Trigger;
export const PopoverAnchor = P.Anchor;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof P.Content>,
  React.ComponentPropsWithoutRef<typeof P.Content>
>(function PopoverContent({ className, align = "center", sideOffset = 4, ...props }, ref) {
  const stamp = useProgramStamp();
  return (
    <P.Portal>
      <P.Content
        ref={ref}
        {...stamp}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
          className,
        )}
        {...props}
      />
    </P.Portal>
  );
});
