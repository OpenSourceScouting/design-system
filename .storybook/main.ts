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
    // aria-query is a CJS module whose named exports (e.g. elementRoles) the
    // vitest browser-mode optimizer does not synthesize when the module is
    // served raw, breaking the Storybook preview runtime and
    // @testing-library/dom. Pre-bundling it forces proper ESM interop.
    viteConfig.optimizeDeps = {
      ...viteConfig.optimizeDeps,
      include: [
        ...(viteConfig.optimizeDeps?.include ?? []),
        "aria-query",
        "lz-string",
        "pretty-format",
      ],
    };
    // Serve under a base path when hosting on GitHub Pages (project pages live
    // at /<repo>/). Local dev and the CI build default to "/". The deploy job
    // in release.yml sets SB_BASE_PATH=/design-system/.
    viteConfig.base = process.env.SB_BASE_PATH ?? "/";
    return viteConfig;
  },
  docs: {
    defaultName: "Docs",
  },
};

export default config;
