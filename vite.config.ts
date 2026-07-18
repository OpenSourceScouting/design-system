import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import path from "node:path";

/**
 * Two build targets from one config, selected by the BUILD_TARGET env var:
 *
 *  - (default / library)  `npm run build`      -> emits the installable package
 *                         into dist/: ES + CJS bundles, .d.ts types, and the
 *                         processed CSS artifacts (styles.css, tokens.css).
 *  - (demo)               `npm run build:demo`  -> the SPA showcase build,
 *                         rooted at demo/ (index.html -> demo/main.tsx).
 *
 * The dev server and the demo build are rooted at demo/ so the showcase entry
 * lives outside the library source. The library build stays rooted at the
 * project root with an explicit src/index.ts entry. `npm run dev` and Storybook
 * do not run either build path; they share the `plugins` / `resolve` config
 * below, so the "@" alias keeps working locally.
 */
const isDemo = process.env.BUILD_TARGET === "demo";

export default defineConfig(({ command }) => {
  const usesDemoRoot = command === "serve" || isDemo;
  return {
    // Dev server + demo build are rooted in demo/; the library build is not.
    root: usesDemoRoot ? path.resolve(__dirname, "demo") : __dirname,
    plugins: [
      react(),
      // Tailwind v4 CSS-first pipeline (replaces PostCSS + the v3 preset). Only
      // active where CSS is in the graph: dev server and demo build import
      // globals.css. The library build (lib mode, entry src/index.ts) pulls in
      // no CSS, so the plugin is a no-op there; dist/styles.css is built
      // separately by scripts/build-css.mjs.
      tailwindcss(),
      // Only emit declaration files for the library build. The demo entry
      // (demo/App.tsx, demo/main.tsx) is outside `src`, so it is naturally
      // excluded without listing it here.
      ...(isDemo
        ? []
        : [
            dts({
              entryRoot: "src",
              include: ["src"],
              exclude: [
                "src/**/*.stories.tsx",
                // Keep test files out of the published type declarations.
                "src/**/__tests__/**",
                "src/**/*.test.ts",
                "src/**/*.test.tsx",
              ],
              insertTypesEntry: true,
            }),
          ]),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // The library build must NOT copy public/ into dist. public/marks/ holds the
    // gitignored, legal-sensitive real BSA brand assets; shipping them in the npm
    // tarball would be a license violation. The dev server and demo build still
    // need public/ (an absolute path, since their root is demo/) so the showcase
    // renders the real marks locally.
    publicDir: usesDemoRoot ? path.resolve(__dirname, "public") : false,
    build: isDemo
      ? {}
      : {
          // Vite lib mode handles the JS/TS surface. The CSS artifacts
          // (dist/styles.css, dist/tokens.css) are produced by the separate
          // `build:css` step in package.json, because lib mode disallows CSS
          // files as rollup inputs and we want fully Tailwind-processed output
          // rather than an inlined component-scoped chunk.
          lib: {
            entry: {
              index: path.resolve(__dirname, "src/index.ts"),
            },
            formats: ["es", "cjs"],
            fileName: (format, entryName) =>
              format === "cjs" ? `${entryName}.cjs` : `${entryName}.js`,
          },
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime", "lucide-react", "radix-ui"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "react/jsx-runtime": "jsxRuntime",
                "lucide-react": "lucideReact",
                "radix-ui": "RadixUI",
              },
            },
          },
        },
  };
});
