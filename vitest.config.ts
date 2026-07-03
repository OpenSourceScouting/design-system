import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Test-only config, deliberately separate from the library build in
 * vite.config.ts. That config carries build.lib + dts + publicDir:false, none
 * of which Vitest needs (and the dts plugin would emit stray declarations
 * during a test run). Here we only need the React plugin (JSX transform) and
 * the "@" alias so tests can import the same way the source does.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
  },
});
