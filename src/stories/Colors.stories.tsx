import type { Meta, StoryObj } from "@storybook/react";
import { PROGRAMS, ScoutThemeProvider } from "../lib/theme/ScoutThemeProvider";

const meta: Meta = {
  title: "Foundations/Color Palette",
};
export default meta;

type Story = StoryObj;

const SA_PALETTE = [
  { name: "SA Red", hex: "#CE1126" },
  { name: "SA Blue", hex: "#003F87" },
  { name: "SA Tan", hex: "#D6CEBD" },
  { name: "SA Gray", hex: "#515354" },
  { name: "SA Pale Blue", hex: "#9AB3D5" },
  { name: "SA Dark Blue", hex: "#003366" },
  { name: "SA Light Tan", hex: "#E9E9E4" },
  { name: "SA Dark Tan", hex: "#AD9D7B" },
  { name: "SA Pale Gray", hex: "#858787" },
  { name: "SA Dark Gray", hex: "#232528" },
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="aspect-[5/3] rounded-program border border-black/10"
        style={{ background: hex }}
      />
      <div className="font-mono text-xs leading-tight">
        <div className="font-semibold">{name}</div>
        <div className="opacity-60">{hex}</div>
      </div>
    </div>
  );
}

function TokenRow({ varName, label }: { varName: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-12 rounded-program border border-black/10"
        style={{ background: `rgb(var(${varName}))` }}
      />
      <div className="font-mono text-xs">
        <div>{label}</div>
        <div className="opacity-60">{varName}</div>
      </div>
    </div>
  );
}

export const ParentBrand: Story = {
  render: () => (
    <div>
      <h3 className="display mb-4 text-xl">Scouting America palette (always available)</h3>
      <p className="font-body mb-4 max-w-2xl text-sm text-muted-foreground">
        The raw brand palette, exposed as the fixed <code>sa-*</code> utilities (e.g.{" "}
        <code>bg-sa-blue</code>). These never theme-swap: use them for cross-program UI and status.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {SA_PALETTE.map((c) => (
          <Swatch key={c.hex} {...c} />
        ))}
      </div>
    </div>
  ),
};

/**
 * The shadcn semantic tokens plus the --os-* extended vocabulary, shown live per
 * program. Note the delta-4 pair: `--accent` is the MUTED hover wash (used by
 * menu/hover states), while the BRAND accent lives in `--os-accent`. Reach for
 * `os-accent` when you want the gold/yellow/red brand pop; a stock shadcn
 * `bg-accent` will render the wash, not the brand color.
 */
export const ProgramSemanticTokens: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      {PROGRAMS.map((p) => (
        <ScoutThemeProvider
          key={p}
          program={p}
          className="rounded-program border border-border p-5"
        >
          <div className="display mb-4 text-sm uppercase tracking-widest text-muted-foreground">
            {p}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TokenRow varName="--background" label="Background" />
            <TokenRow varName="--foreground" label="Foreground" />
            <TokenRow varName="--primary" label="Primary" />
            <TokenRow varName="--primary-foreground" label="Primary Foreground" />
            <TokenRow varName="--secondary" label="Secondary" />
            <TokenRow varName="--muted" label="Muted" />
            <TokenRow varName="--muted-foreground" label="Muted Foreground (AA)" />
            <TokenRow varName="--accent" label="Accent WASH (delta 4)" />
            <TokenRow varName="--os-accent" label="Brand Accent (os-accent)" />
            <TokenRow varName="--os-accent-foreground" label="On Brand Accent" />
            <TokenRow varName="--os-on-primary-soft" label="On Primary Soft" />
            <TokenRow varName="--os-on-surface-faint" label="Faint (>=3:1)" />
            <TokenRow varName="--destructive" label="Destructive" />
            <TokenRow varName="--border" label="Border" />
            <TokenRow varName="--ring" label="Focus Ring" />
          </div>
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};

const RULE_WEIGHTS: Record<
  (typeof PROGRAMS)[number],
  { label: string; weight: string; voice: string }
> = {
  cub: { label: "Cub Scouts", weight: "3px", voice: "chunky, kid-bold" },
  scoutsbsa: { label: "Scouts BSA", weight: "2px", voice: "traditional" },
  venturing: { label: "Venturing", weight: "2px", voice: "blocky geometric" },
  seascouts: { label: "Sea Scouts", weight: "1px", voice: "drafted hairline" },
};

/**
 * Every program sets its own `--os-rule-weight`, which drives the keyline under
 * editorial kickers (CardEyebrow) and other rules. Cub reads heaviest at 3px,
 * Scouts BSA and Venturing sit at 2px, and Sea Scouts drops to a 1px drafted
 * hairline. The bars below are literal `border-b-rule` keylines pulling the live
 * token per theme, so weight differences are exact, not simulated.
 */
export const RuleWeight: Story = {
  render: () => (
    <div>
      <h3 className="display mb-1 text-xl">Program rule weight</h3>
      <p className="font-mono mb-5 text-xs opacity-60">--os-rule-weight</p>
      <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
        {PROGRAMS.map((p) => (
          <ScoutThemeProvider
            key={p}
            program={p}
            className="rounded-program border border-border p-5"
          >
            <div className="mb-4 flex items-baseline justify-between">
              <span className="display text-sm uppercase tracking-widest text-muted-foreground">
                {RULE_WEIGHTS[p].label}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {RULE_WEIGHTS[p].weight}
              </span>
            </div>
            <div className="border-b-rule border-primary pb-3" />
            <p className="font-body mt-3 text-sm text-muted-foreground">{RULE_WEIGHTS[p].voice}</p>
          </ScoutThemeProvider>
        ))}
      </div>
    </div>
  ),
};
