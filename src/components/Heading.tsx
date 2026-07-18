import { createElement, type HTMLAttributes } from "react";
import { cn } from "../lib/utils/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  /** Visual size, decoupled from semantic level (level 2 displayed as size 1, etc.). */
  size?: HeadingLevel;
  /** When true, the heading uses the program's body serif instead of the display family. */
  serif?: boolean;
};

const SIZE_STYLES: Record<HeadingLevel, string> = {
  1: "text-4xl sm:text-5xl md:text-6xl",
  2: "text-3xl sm:text-4xl md:text-5xl",
  3: "text-2xl sm:text-3xl",
  4: "text-xl sm:text-2xl",
  5: "text-lg sm:text-xl",
  6: "text-base sm:text-lg",
};

export function Heading({
  level = 2,
  size,
  serif = false,
  className,
  children,
  ...rest
}: HeadingProps) {
  const tag = `h${level}` as const;
  return createElement(
    tag,
    {
      className: cn(
        serif ? "font-body font-semibold tracking-tight" : "display",
        SIZE_STYLES[size ?? level],
        "text-foreground",
        className,
      ),
      ...rest,
    },
    children,
  );
}
