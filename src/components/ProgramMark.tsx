import { useEffect, useState, type CSSProperties } from "react";
import {
  useScoutTheme,
  PROGRAM_META,
  normalizeBasePath,
  type Program,
} from "@/lib/theme/ScoutThemeProvider";
import { PROGRAM_ICONS } from "./ProgramIcon";
import { cn } from "@/lib/utils/cn";

/**
 * ProgramMark renders a program identity mark in one of three variants.
 *
 * Variants
 * --------
 *   color     The official full-color rendition. Use on light surfaces.
 *   reversed  White-on-dark rendition. Use on the program's primary-colored
 *             backgrounds (EventDialog header, RegistrationCTA, etc.).
 *   mono      Single-color rendition. The BSA Brand Center license permits
 *             "black or any dark color" for this variant.
 *
 * Asset loading
 * -------------
 * The component looks for `/marks/{program}[-variant].{ext}` and tries
 * extensions in this priority order until one loads or all 404:
 *
 *     svg  →  webp  →  png  →  jpg  →  jpeg
 *
 * SVG is preferred (vector, smallest, supports `currentColor` for mono
 * tinting). PNG is the most practical raster (alpha transparency, decent
 * size). JPG works as a last resort but lacks transparency; the rectangular
 * background will be visible against themed surfaces.
 *
 * If every extension 404s, the component falls back to an inline placeholder
 * SVG drawn by us. The placeholders are NOT BSA trademarks.
 *
 * For real assets, NO CSS color utilities are applied to the rendered <img>.
 * The BSA Brand Center license forbids derivative works. The inline
 * placeholders, which we wrote, do accept color utilities per variant.
 *
 * Use `forcePlaceholder` for contexts where you cannot lawfully display the
 * real mark (portfolio shots, open-source demos, non-approved channels).
 */

export type ProgramMarkVariant = "color" | "reversed" | "mono";

export type ProgramMarkProps = {
  program?: Program;
  variant?: ProgramMarkVariant;
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Force the placeholder mark even if a real asset is available. */
  forcePlaceholder?: boolean;
  /**
   * Override the base URL/path for this mark only. Falls back to the
   * ScoutThemeProvider's `marksBasePath`, which itself falls back to
   * VITE_MARKS_BASE_URL or `/marks/`. May be relative or absolute.
   */
  basePath?: string;
};

const EXTENSION_PRIORITY = ["svg", "webp", "png", "jpg", "jpeg"] as const;

function buildAssetUrl(
  basePath: string,
  program: Program,
  variant: ProgramMarkVariant,
  ext: string,
): string {
  const stem = variant === "color" ? program : `${program}-${variant}`;
  return `${basePath}${stem}.${ext}`;
}

/* ───── Placeholder icons (Lucide, ISC; not BSA trademarks) ───── */

// Sourced from PROGRAM_ICONS so the placeholder symbol stays in sync with
// the generic ProgramIcon defaults. Single source of truth lives in
// ProgramIcon.tsx.

/**
 * JPG assets lack an alpha channel, so they ship with a solid background
 * (white for color/mono, black for reversed). These blend modes key out
 * those backgrounds against the surrounding surface:
 *
 *   multiply  white → transparent; dark pixels survive. Good on light surfaces.
 *   screen    black → transparent; light pixels survive. Good on dark surfaces.
 *
 * SVG/PNG/WebP variants with real alpha don't need this, but applying the
 * blend mode is harmless for them (transparent pixels stay transparent).
 *
 * Trade-off vs. the "no derivative works" rule: blend modes don't modify the
 * source bytes, but they do alter on-screen appearance. If your BSA license
 * reviewer pushes back, replace the JPGs with PNG/WebP alpha exports and
 * drop this map.
 */
const BLEND_MODE: Record<ProgramMarkVariant, "multiply" | "screen" | "normal"> = {
  color: "multiply",
  mono: "multiply",
  reversed: "screen",
};

const PLACEHOLDER_TINT: Record<ProgramMarkVariant, string> = {
  color: "text-program-primary",
  reversed: "text-program-on-primary",
  mono: "text-current",
};

/* ───── Component ───── */

export function ProgramMark({
  program,
  variant = "color",
  size = 48,
  className,
  style,
  forcePlaceholder = false,
  basePath,
}: ProgramMarkProps) {
  const ctx = useScoutTheme();
  const active = program ?? ctx.program;
  const meta = PROGRAM_META[active];
  // Resolution priority: prop > theme provider > env var > default. The
  // provider already collapsed (provider value, env var, default) into a
  // single string; we just check for the per-call prop override here.
  const effectiveBasePath = basePath ? normalizeBasePath(basePath) : ctx.marksBasePath;
  const [extIdx, setExtIdx] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  // Reset the extension probe when program, variant, or base path changes so
  // we try the priority list again for the new asset.
  useEffect(() => {
    setExtIdx(0);
    setExhausted(false);
  }, [active, variant, effectiveBasePath]);

  const usePlaceholder = forcePlaceholder || ctx.forcePlaceholderMarks || exhausted;

  if (usePlaceholder) {
    const Placeholder = PROGRAM_ICONS[active];
    return (
      <Placeholder
        role="img"
        aria-label={`${meta.label} placeholder mark (${variant})`}
        width={size}
        height={size}
        strokeWidth={1.75}
        className={cn(PLACEHOLDER_TINT[variant], "shrink-0", className)}
        style={style}
      />
    );
  }

  const ext = EXTENSION_PRIORITY[extIdx];
  const PrintFallbackIcon = PROGRAM_ICONS[active];
  // The reversed variant relies on `mix-blend-mode: screen` keying out the
  // JPG's black background against a dark program-primary surface. Browsers
  // strip background graphics from print by default, leaving white paper
  // behind the mark; `screen` against white paper bleaches the entire image
  // to white. We hide the reversed <img> in print and reveal a generic
  // Lucide placeholder instead so the program is still visually identified
  // on paper. Color/mono variants print fine (multiply against white paper).
  const needsPrintFallback = variant === "reversed";
  return (
    <>
      <img
        // `key` forces the browser to re-fetch when we step to the next extension,
        // even though React might otherwise reuse the element.
        key={`${effectiveBasePath}|${active}-${variant}-${ext}`}
        src={buildAssetUrl(effectiveBasePath, active, variant, ext)}
        alt={`${meta.label} mark`}
        width={size}
        height={size}
        onError={() => {
          if (extIdx < EXTENSION_PRIORITY.length - 1) {
            setExtIdx(extIdx + 1);
          } else {
            setExhausted(true);
          }
        }}
        // No color utilities are applied here. The BSA Brand Center license
        // forbids derivative works on real assets; let the file render its
        // own pixels. The blend mode below only keys out the JPG's solid
        // background against the surrounding surface; transparent assets
        // (SVG/PNG/WebP) are unaffected.
        className={cn("shrink-0", needsPrintFallback && "print:hidden", className)}
        style={{ mixBlendMode: BLEND_MODE[variant], ...style }}
      />
      {needsPrintFallback && (
        <PrintFallbackIcon
          role="img"
          aria-label={`${meta.label} mark`}
          width={size}
          height={size}
          strokeWidth={1.75}
          // Hidden on screen; only the print stylesheet reveals it.
          className={cn(
            "hidden print:inline-block shrink-0 text-program-on-surface",
            className,
          )}
          style={style}
        />
      )}
    </>
  );
}
