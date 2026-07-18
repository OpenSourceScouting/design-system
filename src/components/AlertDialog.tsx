import * as React from "react";
import { AlertDialog as AD } from "radix-ui";
import { useProgramStamp } from "../lib/theme/ScoutThemeProvider";
import { buttonVariants } from "./Button";
import { cn } from "../lib/utils/cn";

/**
 * AlertDialog (shadcn recipe on Radix, our tokens): a modal that interrupts for
 * a confirm/cancel decision (no dismiss-on-outside-click). Action/Cancel reuse
 * the Button recipe. Portalled content re-stamps data-program (delta 9).
 */
export const AlertDialog = AD.Root;
export const AlertDialogTrigger = AD.Trigger;
export const AlertDialogPortal = AD.Portal;

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AD.Overlay>,
  React.ComponentPropsWithoutRef<typeof AD.Overlay>
>(function AlertDialogOverlay({ className, ...props }, ref) {
  return (
    <AD.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/50", className)} {...props} />
  );
});

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AD.Content>,
  React.ComponentPropsWithoutRef<typeof AD.Content>
>(function AlertDialogContent({ className, ...props }, ref) {
  const stamp = useProgramStamp();
  return (
    <AD.Portal>
      <AlertDialogOverlay />
      <AD.Content
        ref={ref}
        {...stamp}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4",
          "rounded-lg border border-border bg-background p-6 text-foreground shadow-lg",
          className,
        )}
        {...props}
      />
    </AD.Portal>
  );
});

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AD.Title>,
  React.ComponentPropsWithoutRef<typeof AD.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  return (
    <AD.Title ref={ref} className={cn("display text-lg leading-tight", className)} {...props} />
  );
});

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AD.Description>,
  React.ComponentPropsWithoutRef<typeof AD.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <AD.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AD.Action>,
  React.ComponentPropsWithoutRef<typeof AD.Action>
>(function AlertDialogAction({ className, ...props }, ref) {
  return (
    <AD.Action
      ref={ref}
      className={cn(buttonVariants({ variant: "primary" }), className)}
      {...props}
    />
  );
});

export const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AD.Cancel>,
  React.ComponentPropsWithoutRef<typeof AD.Cancel>
>(function AlertDialogCancel({ className, ...props }, ref) {
  return (
    <AD.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "secondary" }), className)}
      {...props}
    />
  );
});
