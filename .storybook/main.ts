import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // Browser tab / shared-link title. Storybook renders "<title> - Storybook",
  // so this yields "Open Source Scouting Design System - Storybook" instead of
  // the default "storybook - Storybook".
  title: "Open Source Scouting Design System",
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
    // These are CJS modules whose named/default exports are not synthesized when
    // served raw, which breaks the Storybook preview runtime and
    // @testing-library/dom (e.g. aria-query "does not provide an export named
    // 'elementRoles'"). Pre-bundling them forces proper ESM interop. Vitest runs
    // the browser server with optimizeDeps.noDiscovery, so only these explicit
    // includes get prebundled; without them the CJS deps of @testing-library/dom
    // are served raw and fail to import.
    //
    // These are still required on Vite 8 (Rolldown dep optimizer): with the
    // includes kept the browser project passes under both the esbuild and
    // Rolldown optimizers. See the discussion on vitejs/vite#23030
    // (https://github.com/vitejs/vite/issues/23030); the durable upstream fix is
    // @storybook/addon-vitest adding @testing-library/dom to the include list its
    // vitest plugin already passes, at which point this block can be removed.
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
