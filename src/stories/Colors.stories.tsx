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
      <h3 className="display text-xl mb-4">Scouting America palette (always available)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {SA_PALETTE.map((c) => (
          <Swatch key={c.hex} {...c} />
        ))}
      </div>
    </div>
  ),
};

export const ProgramSemanticTokens: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      {PROGRAMS.map((p) => (
        <ScoutThemeProvider key={p} program={p} className="p-5 rounded-program border border-program-border">
          <div className="display text-sm uppercase tracking-widest mb-4 text-program-on-surface-soft">{p}</div>
          <div className="grid grid-cols-2 gap-3">
            <TokenRow varName="--program-primary" label="Primary" />
            <TokenRow varName="--program-on-primary" label="On Primary" />
            <TokenRow varName="--program-on-primary-soft" label="On Primary Soft" />
            <TokenRow varName="--program-accent" label="Accent" />
            <TokenRow varName="--program-on-accent" label="On Accent" />
            <TokenRow varName="--program-surface" label="Surface" />
            <TokenRow varName="--program-on-surface" label="On Surface" />
            <TokenRow varName="--program-on-surface-soft" label="On Surface Soft (AA)" />
            <TokenRow varName="--program-on-surface-faint" label="On Surface Faint (≥3:1)" />
            <TokenRow varName="--program-surface-muted" label="Surface Muted" />
            <TokenRow varName="--program-border" label="Border" />
            <TokenRow varName="--program-ring" label="Focus Ring" />
          </div>
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};
