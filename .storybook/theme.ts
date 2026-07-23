import { create } from "storybook/theming/create";

// Brand the Storybook sidebar with the Open Source Scouting identity.
// brandImage resolves from staticDirs (../public) configured in main.ts.
// The path is RELATIVE (not "/oss/...") so it resolves against the manager
// document root whether Storybook is served at "/" (local, CI) or under a
// subpath like "/design-system/" (GitHub Pages project site).
export default create({
  base: "light",
  brandTitle: "Open Source Scouting",
  brandUrl: "https://github.com/OpenSourceScouting/design-system",
  brandImage: "./oss/opensourcescouting-logo-color.png",
  brandTarget: "_blank",
  colorPrimary: "#245235",
  colorSecondary: "#245235",
});
