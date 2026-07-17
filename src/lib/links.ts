/**
 * Canonical Scouting America resource links.
 *
 * A single source of truth so that sites built on this system all point at the
 * same authoritative URLs instead of hand-typing (and drifting from) them.
 *
 * These are OFFICIAL EXTERNAL resources published by Scouting America. This
 * project is an independent community effort and is not affiliated with,
 * endorsed by, or sponsored by Scouting America (see NOTICE.md). Linking does
 * not imply endorsement.
 *
 * Maintenance: URLs change when Scouting America reorganizes their site. Treat
 * this file as versioned data: when a URL changes, update it here and record it
 * in CHANGELOG.md so consumers can see the change when they bump the package.
 * Add new entries only with a confirmed, canonical URL.
 */

export type ScoutingLink = {
  /** Human-facing label, safe to render as link text. */
  label: string;
  /** Canonical absolute URL (https). */
  url: string;
  /** One-line description of what the resource is. */
  description: string;
};

export const SCOUTING_LINKS = {
  scoutingAmerica: {
    label: "Scouting America",
    url: "https://www.scouting.org",
    description: "The national Scouting America website.",
  },
  beAScout: {
    label: "Find a Unit (BeAScout)",
    url: "https://beascout.scouting.org",
    description: "The official unit finder for families looking to join.",
  },
  guideToSafeScouting: {
    label: "Guide to Safe Scouting",
    url: "https://www.scouting.org/health-and-safety/gss/toc/",
    description: "Policies and procedures for safe Scouting activities.",
  },
  safeguardingYouth: {
    label: "Safeguarding Youth Training",
    url: "https://www.scouting.org/training/safeguarding-youth/",
    description: "Scouting America's youth protection and safeguarding training.",
  },
} as const satisfies Record<string, ScoutingLink>;

/** Union of the available link keys, e.g. "beAScout". */
export type ScoutingLinkKey = keyof typeof SCOUTING_LINKS;

/** All links as an array, convenient for rendering a list or footer group. */
export const SCOUTING_LINK_LIST: ReadonlyArray<ScoutingLink> = Object.values(SCOUTING_LINKS);
