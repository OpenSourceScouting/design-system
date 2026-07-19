import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

export const PROGRAMS = ["cub", "scoutsbsa", "venturing", "seascouts"] as const;

/** The four built-in national programs that ship with brand tokens and metadata. */
export type KnownProgram = (typeof PROGRAMS)[number];

/**
 * A program identifier. The four national programs autocomplete, but any string
 * is accepted so a third party can register a custom program (a council youth
 * program, or a future fifth national brand) by adding a matching
 * `[data-program="..."]` block to their own CSS, with no fork of this package.
 * See the README "Registering a custom program" section.
 *
 * `KnownProgram | (string & {})` is the standard TypeScript idiom for a
 * "known literals + any string" union: bare `string` would swallow the literals
 * and kill editor autocomplete, so we intersect the widening arm with `{}` to
 * keep the four literals distinct in the union while still accepting arbitrary
 * strings at assignment.
 */
export type Program = KnownProgram | (string & {});

/**
 * Fallback used when an unknown (custom) program is active and we need
 * built-in metadata or a placeholder icon. Scouts BSA is the neutral default
 * (see task 2.8): its tokens are the most brand-agnostic of the four.
 */
export const DEFAULT_PROGRAM: KnownProgram = "scoutsbsa";

/** Type guard: is this string one of the four built-in programs? */
export function isKnownProgram(program: string): program is KnownProgram {
  return (PROGRAMS as readonly string[]).includes(program);
}

/**
 * Narrow any {@link Program} to a {@link KnownProgram} for metadata / icon
 * lookups. Custom programs fall back to {@link DEFAULT_PROGRAM} so components
 * render a sensible default instead of crashing on an undefined record entry.
 * The raw program value is still what gets stamped as `data-program`, so the
 * consumer's custom token block continues to theme the subtree.
 */
export function resolveKnownProgram(program: Program): KnownProgram {
  return isKnownProgram(program) ? program : DEFAULT_PROGRAM;
}

export const PROGRAM_META: Record<
  KnownProgram,
  {
    label: string;
    tagline: string;
    ageRange: string;
    platform: string;
  }
> = {
  cub: {
    label: "Cub Scouts",
    tagline: "Do Your Best. Have Fun Doing It.",
    ageRange: "K-5th grade",
    platform: "Adventure meets fun and friends.",
  },
  scoutsbsa: {
    label: "Scouts BSA",
    tagline: "Be Prepared.",
    ageRange: "Ages 11-17",
    platform: "Test your limits. Gain an edge in life.",
  },
  venturing: {
    label: "Venturing",
    tagline: "Challenge Yourself. Challenge Your World.",
    ageRange: "Ages 14-20",
    platform: "Teamwork and setting your course for adventure.",
  },
  seascouts: {
    label: "Sea Scouts",
    tagline: "Live the Adventure. Navigate the World.",
    ageRange: "Ages 14-20",
    platform: "Maritime skills. Lifelong friendships.",
  },
};

/** Default if no explicit prop and no env var is set. */
const DEFAULT_MARKS_BASE_PATH = "/marks/";

/**
 * Build-time env var fallback. Vite reads this from .env files (or the shell
 * environment) and inlines it at build time. The `VITE_` prefix is required.
 * Wrapped in a try/catch so usage outside a Vite build (e.g. SSR, tests) does
 * not crash.
 */
function readEnvBasePath(): string | undefined {
  try {
    const v = (import.meta as ImportMeta).env?.VITE_MARKS_BASE_URL;
    return typeof v === "string" && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Normalize a base path so the consumer can pass `/marks`, `/marks/`,
 * `https://cdn/x`, or `https://cdn/x/` and we always join cleanly.
 */
export function normalizeBasePath(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

type ScoutThemeContextValue = {
  program: Program;
  /**
   * Optional custom theme layer (e.g. "dark"), stamped as `data-theme`
   * alongside `data-program`. The library ships NO theme values itself; this is
   * the extension hook for a unit or project to layer its own token overrides.
   */
  theme?: string;
  marksBasePath: string;
  /**
   * When true, every ProgramMark in this subtree renders its placeholder SVG
   * even if a real asset is available. Useful for portfolio demos, OSS
   * preview builds, and Storybook globals: anywhere the licensed BSA marks
   * cannot lawfully be displayed.
   */
  forcePlaceholderMarks: boolean;
};

const ScoutThemeContext = createContext<ScoutThemeContextValue | null>(null);

export type ScoutThemeProviderProps = {
  program: Program;
  children: ReactNode;
  /**
   * Optional custom theme layer, stamped as `data-theme` on the wrapper (on
   * `<html>` when `applyToDocument`) and re-stamped onto portalled widgets via
   * `useProgramStamp`, so a custom theme survives inside dialogs/menus/tooltips.
   *
   * The library ships no theme values of its own (Scouting America has no dark
   * mode, and this package aligns to the official design system). This is the
   * hook for a unit or project to add one without forking: set `theme` and
   * supply the token overrides in your own CSS, scoped to `[data-theme]`.
   *
   *   <ScoutThemeProvider program="cub" theme="dark">…</ScoutThemeProvider>
   *
   *   [data-theme="dark"] { --background: 12 15 20; --foreground: 240 244 248; }
   *   // or scope per program:
   *   [data-theme="dark"][data-program="cub"] { --primary: … }
   *
   * Because theming is CSS-variable overrides selected by attribute, a custom
   * theme composes with any program and needs no component changes.
   */
  theme?: string;
  /**
   * Base URL or path where program marks live. May be a relative path
   * (`/marks/`, `/assets/brand/`) or an absolute URL
   * (`https://cdn.example.org/scouting/`).
   *
   * Resolution priority for the effective path:
   *   1. ProgramMark `basePath` prop (per-call override)
   *   2. ScoutThemeProvider `marksBasePath` prop (per-app override)
   *   3. `VITE_MARKS_BASE_URL` env var (per-environment override)
   *   4. `/marks/` (default)
   */
  marksBasePath?: string;
  /**
   * When true, every ProgramMark in this subtree renders its placeholder SVG
   * even if a real asset is available. Per-call `forcePlaceholder` props on
   * ProgramMark still take precedence; this is the subtree-wide fallback.
   */
  forcePlaceholderMarks?: boolean;
  /**
   * When true, the data-program attribute is applied to <html>, theming the
   * entire document. Defaults to false; the provider renders a wrapper div
   * that data-programs only its subtree.
   */
  applyToDocument?: boolean;
  className?: string;
};

export function ScoutThemeProvider({
  program,
  children,
  theme,
  marksBasePath,
  forcePlaceholderMarks = false,
  applyToDocument = false,
  className,
}: ScoutThemeProviderProps) {
  const value = useMemo<ScoutThemeContextValue>(
    () => ({
      program,
      theme,
      marksBasePath: normalizeBasePath(
        marksBasePath ?? readEnvBasePath() ?? DEFAULT_MARKS_BASE_PATH,
      ),
      forcePlaceholderMarks,
    }),
    [program, theme, marksBasePath, forcePlaceholderMarks],
  );

  // Mutating <html> is a side effect: it must not run during render (React 18
  // strict mode renders twice, and SSR has no document). Effects never run on
  // the server, so no typeof-document guard is needed. Cleanup restores the
  // previous value so unmounting (or toggling applyToDocument) does not leave
  // a stale program on the document.
  useEffect(() => {
    if (!applyToDocument) return;
    const root = document.documentElement;
    const previous = root.getAttribute("data-program");
    root.setAttribute("data-program", program);
    return () => {
      if (previous === null) {
        root.removeAttribute("data-program");
      } else {
        root.setAttribute("data-program", previous);
      }
    };
  }, [applyToDocument, program]);

  // Same treatment for the optional custom theme layer, kept as a separate
  // effect so each attribute restores its own prior value independently.
  useEffect(() => {
    if (!applyToDocument || theme === undefined) return;
    const root = document.documentElement;
    const previous = root.getAttribute("data-theme");
    root.setAttribute("data-theme", theme);
    return () => {
      if (previous === null) {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", previous);
      }
    };
  }, [applyToDocument, theme]);

  return (
    <ScoutThemeContext.Provider value={value}>
      <div
        data-program={program}
        data-theme={theme}
        className={className}
        style={{
          // shadcn vocabulary (Phase 1): value-identical to the legacy
          // --background/on-surface (proven by token-mapping.test.ts) but
          // survives the Phase 5 removal of the legacy tokens.
          backgroundColor: "rgb(var(--background))",
          color: "rgb(var(--foreground))",
        }}
      >
        {children}
      </div>
    </ScoutThemeContext.Provider>
  );
}

export function useScoutTheme(): ScoutThemeContextValue {
  const ctx = useContext(ScoutThemeContext);
  if (!ctx) {
    throw new Error("useScoutTheme must be used inside <ScoutThemeProvider>.");
  }
  return ctx;
}

/**
 * Delta 9 helper. Radix `Portal` renders content at document.body, OUTSIDE the
 * themed `[data-program]` subtree, so portalled popovers/menus/dialogs would
 * otherwise fall back to the :root theme. Spread this onto every portalled
 * `*.Content` element to re-stamp the active program and keep its tokens
 * resolving:
 *
 *   function PopoverContent(props) {
 *     const stamp = useProgramStamp();
 *     return <Portal><Content {...stamp} {...props} /></Portal>;
 *   }
 *
 * Factored so the re-stamp cannot be forgotten when adding a new portalled
 * widget. Must be called inside a ScoutThemeProvider (the trigger's subtree).
 *
 * Also re-stamps the custom `data-theme` layer (when set) so a consumer's theme
 * (e.g. dark mode) applies inside portalled content too, not just the main
 * subtree. `data-theme` is omitted when no theme is active.
 */
export function useProgramStamp(): { "data-program": Program; "data-theme"?: string } {
  const { program, theme } = useScoutTheme();
  return { "data-program": program, "data-theme": theme };
}
