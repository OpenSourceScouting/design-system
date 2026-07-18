import type { CSSProperties, ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

export { toast } from "sonner";

export type ToasterProps = ComponentProps<typeof Sonner>;

/**
 * Toast notifications (shadcn's current recommendation: Sonner). Mount one
 * <Toaster /> near the app root, then call `toast(...)` from anywhere.
 *
 * Theming note (intentional): Sonner renders its container at document.body and
 * does not forward attributes to it, so it sits outside the [data-program]
 * subtree. Rather than fight that, toasts deliberately read the parent Scouting
 * America brand tokens (:root) so transient system feedback looks the same in
 * every program: the same rationale as Alert's program-independent status
 * palette. Status toasts (success/error) can opt into Sonner's `richColors`.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "rgb(var(--popover))",
          "--normal-text": "rgb(var(--popover-foreground))",
          "--normal-border": "rgb(var(--border))",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      {...props}
    />
  );
}
