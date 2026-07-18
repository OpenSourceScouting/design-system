import * as React from "react";
import { DropdownMenu as DM } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { useProgramStamp } from "../lib/theme/ScoutThemeProvider";
import { Icon } from "./Icon";
import { cn } from "../lib/utils/cn";

/**
 * DropdownMenu (shadcn recipe on Radix, our tokens). Item focus uses bg-accent
 * (the muted wash, delta 4), NOT the brand accent. Portalled content re-stamps
 * data-program via useProgramStamp (delta 9).
 */
export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;
export const DropdownMenuGroup = DM.Group;
export const DropdownMenuPortal = DM.Portal;
export const DropdownMenuSub = DM.Sub;
export const DropdownMenuRadioGroup = DM.RadioGroup;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DM.Content>,
  React.ComponentPropsWithoutRef<typeof DM.Content>
>(function DropdownMenuContent({ className, sideOffset = 4, ...props }, ref) {
  const stamp = useProgramStamp();
  return (
    <DM.Portal>
      <DM.Content
        ref={ref}
        {...stamp}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg",
          className,
        )}
        {...props}
      />
    </DM.Portal>
  );
});

const itemClasses =
  "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none " +
  "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DM.Item>,
  React.ComponentPropsWithoutRef<typeof DM.Item> & { inset?: boolean }
>(function DropdownMenuItem({ className, inset, ...props }, ref) {
  return <DM.Item ref={ref} className={cn(itemClasses, inset && "pl-8", className)} {...props} />;
});

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DM.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DM.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <DM.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemClasses, "pl-8", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DM.ItemIndicator>
          <Icon icon={Check} size={16} />
        </DM.ItemIndicator>
      </span>
      {children}
    </DM.CheckboxItem>
  );
});

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DM.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DM.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <DM.RadioItem ref={ref} className={cn(itemClasses, "pl-8", className)} {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DM.ItemIndicator>
          <Icon icon={Circle} size={8} className="fill-current" />
        </DM.ItemIndicator>
      </span>
      {children}
    </DM.RadioItem>
  );
});

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DM.Label>,
  React.ComponentPropsWithoutRef<typeof DM.Label> & { inset?: boolean }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return (
    <DM.Label
      ref={ref}
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DM.Separator>,
  React.ComponentPropsWithoutRef<typeof DM.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <DM.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  );
});

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
  );
}

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DM.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DM.SubTrigger> & { inset?: boolean }
>(function DropdownMenuSubTrigger({ className, inset, children, ...props }, ref) {
  return (
    <DM.SubTrigger
      ref={ref}
      className={cn(itemClasses, "data-[state=open]:bg-accent", inset && "pl-8", className)}
      {...props}
    >
      {children}
      <Icon icon={ChevronRight} size={16} className="ml-auto" />
    </DM.SubTrigger>
  );
});

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DM.SubContent>,
  React.ComponentPropsWithoutRef<typeof DM.SubContent>
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  const stamp = useProgramStamp();
  return (
    <DM.Portal>
      <DM.SubContent
        ref={ref}
        {...stamp}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg",
          className,
        )}
        {...props}
      />
    </DM.Portal>
  );
});
