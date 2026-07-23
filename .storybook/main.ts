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
    // These are CJS modules whose named/default exports the Vitest browser-mode
    // dep optimizer does not synthesize when they are served raw, which breaks
    // the Storybook preview runtime and @testing-library/dom (e.g. aria-query
    // "does not provide an export named 'elementRoles'"). Pre-bundling them
    // forces proper ESM interop.
    //
    // TRACKING: this is also why the project stays on Vite 7. Vite 8 swaps
    // esbuild for the Rolldown dep optimizer, which makes the same CJS interop
    // worse: the include list below no longer fixes it and the error cascades
    // to a hard `exports is not defined`. Filed as vitejs/vite#23030
    // (https://github.com/vitejs/vite/issues/23030), with a runnable repro on
    // the repro/vite8-rolldown-cjs-interop branch. Revisit Vite 8 once that
    // (and rolldown/rolldown#9502) is fixed.
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
