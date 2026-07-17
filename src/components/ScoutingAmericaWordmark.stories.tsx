import type { Meta, StoryObj } from "@storybook/react";
import { ScoutingAmericaWordmark } from "./ScoutingAmericaWordmark";

const meta: Meta<typeof ScoutingAmericaWordmark> = {
  title: "Foundations/ScoutingAmericaWordmark",
  component: ScoutingAmericaWordmark,
  parameters: {
    docs: {
      description: {
        component:
          "Official Scouting America wordmark. Two orientations (wide, tall) " +
          "× three variants (color, mono, reversed). Loads /marks/scouting-america-" +
          "wordmark-{orientation}[-{variant}].{ext}. NO placeholder fallback: if the " +
          "asset is missing, the component renders nothing and logs a warning. " +
          "Per BSA license, the wordmark is reserved for official Scouting contexts.",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["wide", "tall"] },
    variant: { control: "select", options: ["color", "mono", "reversed"] },
    height: { control: { type: "number", min: 24, max: 240, step: 8 } },
  },
};
export default meta;

type Story = StoryObj<typeof ScoutingAmericaWordmark>;

export const WideColor: Story = {
  args: { orientation: "wide", variant: "color", height: 64 },
};

export const TallColor: Story = {
  args: { orientation: "tall", variant: "color", height: 120 },
};

export const Mono: Story = {
  args: { orientation: "wide", variant: "mono", height: 64 },
  parameters: {
    docs: {
      description: {
        story:
          "Single-color rendition. The BSA license permits this variant in any " +
          "dark color, but visible recoloring requires an SVG asset using " +
          'fill="currentColor". JPG/PNG renditions display baked pixels.',
      },
    },
  },
};

export const Reversed: Story = {
  args: { orientation: "wide", variant: "reversed", height: 64 },
  render: (args) => (
    <div className="p-6 bg-program-primary rounded-program inline-flex items-center justify-center">
      <ScoutingAmericaWordmark {...args} />
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => {
    // Cell heights are fixed per row so the reversed wrapper's padding
    // doesn't bump that cell taller than the unpadded color/mono cells.
    // Every cell uses flex centering for consistent vertical placement.
    const wideCellHeight = 96;
    const wideMarkHeight = 56;
    const tallCellHeight = 168;
    const tallMarkHeight = 120;
    return (
      <div className="space-y-8">
        <section className="space-y-3">
          <h3 className="display text-xs uppercase tracking-widest text-program-on-surface-soft">
            Wide
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center justify-center" style={{ height: wideCellHeight }}>
              <ScoutingAmericaWordmark orientation="wide" variant="color" height={wideMarkHeight} />
            </div>
            <div className="flex items-center justify-center" style={{ height: wideCellHeight }}>
              <ScoutingAmericaWordmark orientation="wide" variant="mono" height={wideMarkHeight} />
            </div>
            <div
              className="flex items-center justify-center p-3 bg-program-primary rounded-program"
              style={{ height: wideCellHeight }}
            >
              <ScoutingAmericaWordmark
                orientation="wide"
                variant="reversed"
                height={wideMarkHeight}
              />
            </div>
          </div>
        </section>
        <section className="space-y-3">
          <h3 className="display text-xs uppercase tracking-widest text-program-on-surface-soft">
            Tall
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center justify-center" style={{ height: tallCellHeight }}>
              <ScoutingAmericaWordmark orientation="tall" variant="color" height={tallMarkHeight} />
            </div>
            <div className="flex items-center justify-center" style={{ height: tallCellHeight }}>
              <ScoutingAmericaWordmark orientation="tall" variant="mono" height={tallMarkHeight} />
            </div>
            <div
              className="flex items-center justify-center p-3 bg-program-primary rounded-program"
              style={{ height: tallCellHeight }}
            >
              <ScoutingAmericaWordmark
                orientation="tall"
                variant="reversed"
                height={tallMarkHeight}
              />
            </div>
          </div>
        </section>
      </div>
    );
  },
};

export const MissingAsset: Story = {
  args: { orientation: "wide", variant: "color", height: 64, basePath: "/nonexistent/" },
  parameters: {
    docs: {
      description: {
        story:
          "When no asset can be loaded, the component renders nothing and logs " +
          "a warning to the console. This is intentional: per the BSA license, " +
          "no generic substitute is permitted for the wordmark.",
      },
    },
  },
};
