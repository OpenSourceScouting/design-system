import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-vitest"],
  // Serve public/ so the manager brand image and favicons resolve at /oss/... etc.
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  // Tailwind v4 CSS-first pipeline. postcss.config.js is deleted, so Storybook's
  // vite no longer loads the v3 tailwind PostCSS plugin; @tailwindcss/vite
  // handles processing (the preview imports src/styles/globals.css).
  viteFinal: async (viteConfig) => {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    return viteConfig;
  },
  docs: {
    defaultName: "Docs",
  },
};

export default config;
