import { describe, it, expect } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import { ScoutThemeProvider, useScoutTheme } from "../ScoutThemeProvider";

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
});
