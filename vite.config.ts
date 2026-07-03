import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";

/**
 * Two build targets from one config, selected by the BUILD_TARGET env var:
 *
 *  - (default / library)  `npm run build`      -> emits the installable package
 *                         into dist/: ES + CJS bundles, .d.ts types, and the
 *                         processed CSS artifacts (styles.css, tokens.css).
 *  - (demo)               `npm run build:demo`  -> the old SPA showcase build
 *                         driven by index.html -> src/main.tsx.
 *
 * `npm run dev` and Storybook do not run either build path; they use the shared
 * `plugins` / `resolve` config below, so the "@" alias keeps working locally.
 */
const isDemo = process.env.BUILD_TARGET === "demo";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // Only emit declaration files for the library build.
    ...(isDemo
      ? []
      : [
          dts({
            entryRoot: "src",
            include: ["src"],
            exclude: ["src/**/*.stories.tsx", "src/App.tsx", "src/main.tsx"],
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
  // tarball would be a license violation. The dev server and the demo build
  // still need public/ so the showcase renders the real marks locally.
  publicDir: command === "serve" || isDemo ? "public" : false,
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
          external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime",
              "lucide-react": "lucideReact",
            },
          },
        },
      },
}));
