/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL or path where program marks are served from.
   * Defaults to `/marks/` when unset.
   *
   * Examples:
   *   /marks/                            (default, project's public/marks/)
   *   /assets/brand/                     (relocated within the same origin)
   *   https://cdn.example.org/scouting/  (external CDN)
   *
   * Read by ScoutThemeProvider as the fallback when no explicit
   * marksBasePath prop is provided.
   */
  readonly VITE_MARKS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
