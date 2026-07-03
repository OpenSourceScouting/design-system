import "@testing-library/jest-dom/vitest";
import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";

// jest-axe ships a custom matcher; register it on Vitest's expect.
expect.extend(toHaveNoViolations);

// jsdom does not implement matchMedia. Calendar uses it to fall back to the
// agenda view on narrow viewports (task 1.5). Provide a minimal stub that
// reports "not narrow" so month/agenda render as requested by the prop.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// Unmount React trees between tests so document.body stays clean and axe scans
// only the component under test.
afterEach(() => {
  cleanup();
});
