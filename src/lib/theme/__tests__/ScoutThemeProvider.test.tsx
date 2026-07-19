import { describe, it, expect } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import {
  ScoutThemeProvider,
  useScoutTheme,
  useProgramStamp,
  isKnownProgram,
  resolveKnownProgram,
  DEFAULT_PROGRAM,
} from "../ScoutThemeProvider";
import { ProgramHero } from "../../../components/ProgramHero";

describe("ScoutThemeProvider", () => {
  it("sets data-program on its wrapper subtree", () => {
    render(
      <ScoutThemeProvider program="venturing">
        <span>child</span>
      </ScoutThemeProvider>,
    );
    const child = screen.getByText("child");
    expect(child.closest("[data-program]")).toHaveAttribute("data-program", "venturing");
  });

  it("applyToDocument sets the attribute on <html> and cleans up on unmount", () => {
    expect(document.documentElement.hasAttribute("data-program")).toBe(false);
    const { unmount } = render(
      <ScoutThemeProvider program="seascouts" applyToDocument>
        <span>child</span>
      </ScoutThemeProvider>,
    );
    expect(document.documentElement.getAttribute("data-program")).toBe("seascouts");
    unmount();
    expect(document.documentElement.hasAttribute("data-program")).toBe(false);
  });

  it("useScoutTheme throws without a provider ancestor", () => {
    expect(() => renderHook(() => useScoutTheme())).toThrowError(
      /must be used inside <ScoutThemeProvider>/,
    );
  });

  it("useScoutTheme returns the active program inside a provider", () => {
    const { result } = renderHook(() => useScoutTheme(), {
      wrapper: ({ children }) => (
        <ScoutThemeProvider program="scoutsbsa">{children}</ScoutThemeProvider>
      ),
    });
    expect(result.current.program).toBe("scoutsbsa");
    expect(result.current.marksBasePath).toBe("/marks/");
  });

  // Task 2.8: the Program union is open, so a consumer may register a custom
  // program by name. The raw value must reach data-program (so their CSS block
  // applies), while metadata/icon lookups fall back to a known program.
  describe("custom (open) program support", () => {
    it("isKnownProgram distinguishes built-ins from custom names", () => {
      expect(isKnownProgram("cub")).toBe(true);
      expect(isKnownProgram("explorers")).toBe(false);
    });

    it("resolveKnownProgram passes known programs through and falls back otherwise", () => {
      expect(resolveKnownProgram("venturing")).toBe("venturing");
      expect(resolveKnownProgram("explorers")).toBe(DEFAULT_PROGRAM);
    });

    it("stamps a custom program name onto data-program verbatim", () => {
      render(
        <ScoutThemeProvider program="explorers">
          <span>child</span>
        </ScoutThemeProvider>,
      );
      const child = screen.getByText("child");
      expect(child.closest("[data-program]")).toHaveAttribute("data-program", "explorers");
    });

    it("renders program-metadata consumers with the fallback instead of crashing", () => {
      // ProgramHero reads PROGRAM_META[program].label; an unknown program must
      // not throw on an undefined record entry.
      expect(() =>
        render(
          <ScoutThemeProvider program="explorers">
            <ProgramHero headline="Welcome" watermark={false} />
          </ScoutThemeProvider>,
        ),
      ).not.toThrow();
    });
  });

  // The custom-theme hook: the library ships no theme values, but a consumer can
  // layer one (e.g. dark mode) via the `theme` prop + their own [data-theme] CSS.
  describe("custom theme layer (data-theme hook)", () => {
    it("stamps data-theme on the wrapper alongside data-program", () => {
      render(
        <ScoutThemeProvider program="cub" theme="dark">
          <span>child</span>
        </ScoutThemeProvider>,
      );
      const el = screen.getByText("child").closest("[data-program]");
      expect(el).toHaveAttribute("data-program", "cub");
      expect(el).toHaveAttribute("data-theme", "dark");
    });

    it("omits data-theme when no theme is set", () => {
      render(
        <ScoutThemeProvider program="cub">
          <span>child</span>
        </ScoutThemeProvider>,
      );
      expect(screen.getByText("child").closest("[data-program]")).not.toHaveAttribute("data-theme");
    });

    it("useProgramStamp re-stamps program and theme so portals keep the theme", () => {
      const { result } = renderHook(() => useProgramStamp(), {
        wrapper: ({ children }) => (
          <ScoutThemeProvider program="venturing" theme="dark">
            {children}
          </ScoutThemeProvider>
        ),
      });
      expect(result.current).toEqual({ "data-program": "venturing", "data-theme": "dark" });
    });

    it("applyToDocument sets and cleans up data-theme on <html>", () => {
      expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
      const { unmount } = render(
        <ScoutThemeProvider program="seascouts" theme="dark" applyToDocument>
          <span>child</span>
        </ScoutThemeProvider>,
      );
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
      unmount();
      expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    });
  });
});
