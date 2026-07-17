import { describe, it, expect } from "vitest";
import { SCOUTING_LINKS, SCOUTING_LINK_LIST } from "../links";

describe("SCOUTING_LINKS", () => {
  const entries = Object.entries(SCOUTING_LINKS);

  it("every link is an absolute https URL with a label and description", () => {
    for (const [key, link] of entries) {
      expect(link.label, `${key}.label`).toBeTruthy();
      expect(link.description, `${key}.description`).toBeTruthy();
      expect(() => new URL(link.url), `${key}.url parses`).not.toThrow();
      expect(link.url.startsWith("https://"), `${key}.url is https`).toBe(true);
    }
  });

  it("has no duplicate URLs", () => {
    const urls = entries.map(([, l]) => l.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("SCOUTING_LINK_LIST mirrors the map", () => {
    expect(SCOUTING_LINK_LIST).toHaveLength(entries.length);
  });
});
