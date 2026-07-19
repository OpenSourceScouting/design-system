/**
 * Self-hosted fonts example (task 2.2).
 *
 * A minimal app entry for a consumer of `@opensourcescouting/design-system`
 * that wants ZERO third-party font requests. The two brand families ship as
 * `@fontsource-variable` packages, so `npm install`-ing them and importing the
 * four CSS files below registers the faces from your own origin: no Google
 * Fonts, no jsDelivr, nothing off-box.
 *
 * Install first:
 *   npm i @opensourcescouting/design-system \
 *         @fontsource-variable/montserrat @fontsource-variable/source-serif-4
 *
 * The families must register under the exact names tokens.css references:
 * "Montserrat Variable" (display / UI chrome) and "Source Serif 4 Variable"
 * (body copy). The @fontsource-variable packages already use those names, so
 * no @font-face wiring is needed. Absent these faces, components still render
 * on the platform system fonts.
 */

// 1. The four font imports: each family in its roman and italic axes.
import "@fontsource-variable/montserrat";
import "@fontsource-variable/montserrat/wght-italic.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";

// 2. The design system's styles: tokens (per-program CSS variables) + theme
//    (maps them to Tailwind utilities). Import these once at the app root.
import "@opensourcescouting/design-system/tokens";
import "@opensourcescouting/design-system/theme";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ScoutThemeProvider, ProgramHero, Button } from "@opensourcescouting/design-system";

function App() {
  return (
    // `program` selects the active brand; swap to "scoutsbsa" | "venturing" |
    // "seascouts", or a custom program you registered (see the README).
    <ScoutThemeProvider program="cub" applyToDocument>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <ProgramHero
          eyebrow="Welcome"
          headline="Fonts served from your own origin"
          lede="Montserrat and Source Serif 4 load from bundled @fontsource-variable packages, so this page makes no third-party font request."
          primaryAction={{ label: "Get started" }}
        />
        <Button variant="accent">Join the fun</Button>
      </main>
    </ScoutThemeProvider>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
