import { useEffect, useState, type CSSProperties } from "react";
import { useScoutTheme, normalizeBasePath } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

/**
 * ScoutingAmericaWordmark renders the official Scouting America wordmark.
 *
 * Unlike ProgramMark, this component has NO placeholder fallback. If the
 * licensed asset cannot be loaded, the component renders null and logs a
 * warning. Per the BSA license, the wordmark is reserved for official
 * Scouting contexts only; we do not invent a generic substitute.
 *
 * Asset path:
 *   /marks/scouting-america-wordmark-{orientation}[-{variant}].{ext}
 *
 * Examples:
 *   scouting-america-wordmark-wide.svg
 *   scouting-america-wordmark-wide-mono.png
 *   scouting-america-wordmark-tall-reversed.jpg
 *
 * Sizing
 * ------
 * Pass `height` only. Width is auto-derived from the image's intrinsic
 * aspect ratio, which differs between wide (~4:1) and tall (~1:1.3)
 * orientations. The component does not enforce a width; the asset's
 * pixels drive layout.
 */

export type ScoutingAmericaWordmarkOrientation = "wide" | "tall";
export type ScoutingAmericaWordmarkVariant = "color" | "mono" | "reversed";

export type ScoutingAmericaWordmarkProps = {
  orientation?: ScoutingAmericaWordmarkOrientation;
  variant?: ScoutingAmericaWordmarkVariant;
  /** Rendered height in px. Width auto-derives from the asset's aspect ratio. */
  height?: number;
  className?: string;
  style?: CSSProperties;
  basePath?: string;
};

const STEM_BASE = "scouting-america-wordmark";
const EXTENSION_PRIORITY = ["svg", "webp", "png", "jpg", "jpeg"] as const;

// Same blend modes as ProgramMark: keys out the JPG's solid background
// against the surrounding surface. Transparent (SVG/PNG/WebP) assets are
// unaffected.
const BLEND_MODE: Record<ScoutingAmericaWordmarkVariant, "multiply" | "screen" | "normal"> = {
  color: "multiply",
  mono: "multiply",
  reversed: "screen",
};

function buildAssetUrl(
  basePath: string,
  orientation: ScoutingAmericaWordmarkOrientation,
  variant: ScoutingAmericaWordmarkVariant,
  ext: string,
): string {
  const variantSuffix = variant === "color" ? "" : `-${variant}`;
  return `${basePath}${STEM_BASE}-${orientation}${variantSuffix}.${ext}`;
}

export function ScoutingAmericaWordmark({
  orientation = "wide",
  variant = "color",
  height = 48,
  className,
  style,
  basePath,
}: ScoutingAmericaWordmarkProps) {
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
        `[ScoutingAmericaWordmark] no asset found for ` +
          `${orientation}/${variant} at ${effectiveBasePath}. No placeholder will render.`,
      );
    }
    return null;
  }

  const ext = EXTENSION_PRIORITY[extIdx];
  // Reversed variant relies on dark `bg-program-primary` behind it; in print
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
