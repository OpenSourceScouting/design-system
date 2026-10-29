import { useEffect, useState, type CSSProperties } from "react";
import { useScoutTheme, normalizeBasePath } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

/**
 * ParentBrandWordmark renders the official parent-brand wordmark from a
 * licensed asset you supply (see public/marks/README.md).
 *
 * Unlike ProgramMark, this component has NO placeholder fallback. If the
 * licensed asset cannot be loaded, the component renders null and logs a
 * warning. Per the BSA license, the wordmark is reserved for official
 * Scouting contexts only; we do not invent a generic substitute.
 *
 * Asset path:
 *   /marks/parent-brand-wordmark-{orientation}[-{variant}].{ext}
 *
 * Examples:
 *   parent-brand-wordmark-wide.svg
 *   parent-brand-wordmark-wide-mono.png
 *   parent-brand-wordmark-tall-reversed.jpg
 *
 * Sizing
 * ------
 * Pass `height` only. Width is auto-derived from the image's intrinsic
 * aspect ratio, which differs between wide (~4:1) and tall (~1:1.3)
 * orientations. The component does not enforce a width; the asset's
 * pixels drive layout.
 */

export type ParentBrandWordmarkOrientation = "wide" | "tall";
export type ParentBrandWordmarkVariant = "color" | "mono" | "reversed";

export type ParentBrandWordmarkProps = {
  orientation?: ParentBrandWordmarkOrientation;
  variant?: ParentBrandWordmarkVariant;
  /** Rendered height in px. Width auto-derives from the asset's aspect ratio. */
  height?: number;
  className?: string;
  style?: CSSProperties;
  basePath?: string;
};

const STEM_BASE = "parent-brand-wordmark";
const EXTENSION_PRIORITY = ["svg", "webp", "png", "jpg", "jpeg"] as const;

// Same blend modes as ProgramMark: keys out the JPG's solid background
// against the surrounding surface. Transparent (SVG/PNG/WebP) assets are
// unaffected.
const BLEND_MODE: Record<ParentBrandWordmarkVariant, "multiply" | "screen" | "normal"> = {
  color: "multiply",
  mono: "multiply",
  reversed: "screen",
};

function buildAssetUrl(
  basePath: string,
  orientation: ParentBrandWordmarkOrientation,
  variant: ParentBrandWordmarkVariant,
  ext: string,
): string {
  const variantSuffix = variant === "color" ? "" : `-${variant}`;
  return `${basePath}${STEM_BASE}-${orientation}${variantSuffix}.${ext}`;
}

export function ParentBrandWordmark({
  orientation = "wide",
  variant = "color",
  height = 48,
  className,
  style,
  basePath,
}: ParentBrandWordmarkProps) {
  const ctx = useScoutTheme();
  const effectiveBasePath = basePath ? normalizeBasePath(basePath) : ctx.marksBasePath;
  const [extIdx, setExtIdx] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    setExtIdx(0);
    setExhausted(false);
  }, [orientation, variant, effectiveBasePath]);

  if (exhausted) {
    if (typeof console !== "undefined") {
      console.warn(
        `[ParentBrandWordmark] no asset found for ` +
          `${orientation}/${variant} at ${effectiveBasePath}. No placeholder will render.`,
      );
    }
    return null;
  }

  const ext = EXTENSION_PRIORITY[extIdx];
  // Reversed variant relies on dark `bg-primary` behind it; in print
  // (background graphics off), the screen blend bleaches it to white paper.
  // We render nothing in print rather than fall back to a generic, per the
  // "no generics" rule for this asset.
  const hideInPrint = variant === "reversed";

  return (
    <img
      key={`${effectiveBasePath}|${STEM_BASE}-${orientation}-${variant}-${ext}`}
      src={buildAssetUrl(effectiveBasePath, orientation, variant, ext)}
      alt="Scouting America"
      height={height}
      onError={() => {
        if (extIdx < EXTENSION_PRIORITY.length - 1) {
          setExtIdx(extIdx + 1);
        } else {
          setExhausted(true);
        }
      }}
      className={cn("shrink-0 w-auto", hideInPrint && "print:hidden", className)}
      style={{ height, mixBlendMode: BLEND_MODE[variant], ...style }}
    />
  );
}
