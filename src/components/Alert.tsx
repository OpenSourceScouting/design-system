import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils/cn";

export type AlertTone = "info" | "success" | "warning" | "danger";

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: ReactNode;
  icon?: ReactNode;
};

/**
 * Note: tone colors intentionally come from the raw `sa.*` palette, not the
 * program tokens. System feedback should read the same regardless of which
 * program is theming the surrounding UI (this is why tone is a multi-slot
 * record rather than a cva variant: ring/chip/chipText move together and are
 * deliberately program-independent). The surface and body text use the shadcn
 * card/foreground tokens so the alert still feels at home in each program.
 *
 * Exported so consumers can spread it and register extra tones from a wrapper
 * component (task 2.9) without forking: e.g.
 *   const TONES = { ...alertToneStyles, brand: { ring, chip, chipText } };
 */
export const alertToneStyles: Record<
  AlertTone,
  { ring: string; chip: string; chipText: string }
> = {
  info: { ring: "border-sa-blue/40", chip: "bg-sa-blue", chipText: "text-white" },
  success: { ring: "border-sa-blue/40", chip: "bg-[#006B3F]", chipText: "text-white" },
  warning: { ring: "border-[#996633]/40", chip: "bg-[#FCD116]", chipText: "text-sa-dark-gray" },
  danger: { ring: "border-sa-red/40", chip: "bg-sa-red", chipText: "text-white" },
};

export function Alert({ tone = "info", title, icon, className, children, ...rest }: AlertProps) {
  const t = alertToneStyles[tone];
  return (
    <div
      role="status"
      className={cn("flex gap-3 rounded-lg border bg-card p-4", t.ring, className)}
      {...rest}
    >
      <div
        aria-hidden
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
          t.chip,
          t.chipText,
        )}
      >
        {icon ?? "!"}
      </div>
      <div className="flex-1 text-sm leading-relaxed">
        {title ? <div className="display mb-0.5 text-base">{title}</div> : null}
        <div className="text-foreground/85">{children}</div>
      </div>
    </div>
  );
}
