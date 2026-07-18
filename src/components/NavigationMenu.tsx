import * as React from "react";
import { NavigationMenu as NM } from "radix-ui";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { Icon } from "./Icon";
import { cn } from "../lib/utils/cn";

/**
 * NavigationMenu (shadcn recipe on Radix, our tokens). The Viewport renders
 * inside the Root (not a body portal), so it stays within the themed subtree and
 * needs no data-program re-stamp. UI chrome uses the display font.
 */
export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NM.Root>,
  React.ComponentPropsWithoutRef<typeof NM.Root>
>(function NavigationMenu({ className, children, ...props }, ref) {
  return (
    <NM.Root
      ref={ref}
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NM.Root>
  );
});

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NM.List>,
  React.ComponentPropsWithoutRef<typeof NM.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <NM.List
      ref={ref}
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
});

export const NavigationMenuItem = NM.Item;

export const navigationMenuTriggerStyle = cva(
  "font-display group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors " +
    "hover:bg-muted hover:text-foreground focus:bg-muted focus:outline-none disabled:pointer-events-none disabled:opacity-50 " +
    "data-[state=open]:bg-muted",
);

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NM.Trigger>,
  React.ComponentPropsWithoutRef<typeof NM.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NM.Trigger
      ref={ref}
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}
      <Icon
        icon={ChevronDown}
        size={14}
        className="relative top-px ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </NM.Trigger>
  );
});

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NM.Content>,
  React.ComponentPropsWithoutRef<typeof NM.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return (
    <NM.Content
      ref={ref}
      className={cn("left-0 top-0 w-full p-2 md:absolute md:w-auto", className)}
      {...props}
    />
  );
});

export const NavigationMenuLink = NM.Link;

export const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NM.Viewport>,
  React.ComponentPropsWithoutRef<typeof NM.Viewport>
>(function NavigationMenuViewport({ className, ...props }, ref) {
  return (
    <div className="absolute left-0 top-full flex justify-center">
      <NM.Viewport
        ref={ref}
        className={cn(
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
});

export const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NM.Indicator>,
  React.ComponentPropsWithoutRef<typeof NM.Indicator>
>(function NavigationMenuIndicator({ className, ...props }, ref) {
  return (
    <NM.Indicator
      ref={ref}
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm border-l border-t border-border bg-popover" />
    </NM.Indicator>
  );
});
