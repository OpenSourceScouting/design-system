import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { ScoutThemeProvider, type Program } from "../../lib/theme/ScoutThemeProvider";

/**
 * Render a component inside a ScoutThemeProvider (default program "cub") so
 * context-reading components (ProgramHero, RegistrationCTA, ProgramMark,
 * DecorativeDivider) do not throw. Returns the standard RTL result.
 */
export function renderThemed(ui: ReactElement, program: Program = "cub"): RenderResult {
  return render(<ScoutThemeProvider program={program}>{ui}</ScoutThemeProvider>);
}
