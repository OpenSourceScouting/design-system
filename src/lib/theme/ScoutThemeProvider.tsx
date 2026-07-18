import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

export const PROGRAMS = ["cub", "scoutsbsa", "venturing", "seascouts"] as const;
export type Program = (typeof PROGRAMS)[number];

export const PROGRAM_META: Record<
  Program,
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
  marksBasePath,
  forcePlaceholderMarks = false,
  applyToDocument = false,
  className,
}: ScoutThemeProviderProps) {
  const value = useMemo<ScoutThemeContextValue>(
    () => ({
      program,
      marksBasePath: normalizeBasePath(
        marksBasePath ?? readEnvBasePath() ?? DEFAULT_MARKS_BASE_PATH,
      ),
      forcePlaceholderMarks,
    }),
    [program, marksBasePath, forcePlaceholderMarks],
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

  return (
    <ScoutThemeContext.Provider value={value}>
      <div
        data-program={program}
        className={className}
        style={{
          // shadcn vocabulary (Phase 1): value-identical to the legacy
          // --program-surface/on-surface (proven by token-mapping.test.ts) but
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
