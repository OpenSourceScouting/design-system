import * as React from "react";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { useProgramStamp } from "../lib/theme/ScoutThemeProvider";
import { Icon } from "./Icon";
import { cn } from "../lib/utils/cn";

/**
 * Dialog (shadcn recipe on Radix, our tokens). Portalled content re-stamps
 * data-program (delta 9). Floating elevation uses shadow-lg, not shadow-program
 * (the per-program shadow is intentionally faint, too weak for a modal).
 */
export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export const DialogPortal = D.Portal;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof D.Overlay>,
  React.ComponentPropsWithoutRef<typeof D.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <D.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/50", className)} {...props} />
  );
});

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof D.Content>,
  React.ComponentPropsWithoutRef<typeof D.Content> & { showClose?: boolean }
>(function DialogContent({ className, children, showClose = true, ...props }, ref) {
  const stamp = useProgramStamp();
  return (
    <D.Portal>
      <DialogOverlay />
      <D.Content
        ref={ref}
        {...stamp}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4",
          "rounded-lg border border-border bg-background p-6 text-foreground shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <D.Close
            className="absolute right-4 top-4 rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none"
            aria-label="Close"
          >
            <Icon icon={X} size={18} />
          </D.Close>
        ) : null}
      </D.Content>
    </D.Portal>
  );
});

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof D.Title>,
  React.ComponentPropsWithoutRef<typeof D.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <D.Title ref={ref} className={cn("display text-lg leading-tight", className)} {...props} />
  );
});

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof D.Description>,
  React.ComponentPropsWithoutRef<typeof D.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <D.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
