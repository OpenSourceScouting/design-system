import { create } from "@storybook/theming/create";

// Brand the Storybook sidebar with the Open Source Scouting identity.
// brandImage resolves from staticDirs (../public) configured in main.ts.
export default create({
  base: "light",
  brandTitle: "Open Source Scouting",
  brandUrl: "https://github.com/opensourcescouting/design-system",
  brandImage: "/oss/opensourcescouting-logo-color.png",
  brandTarget: "_blank",
  colorPrimary: "#245235",
  colorSecondary: "#245235",
});
