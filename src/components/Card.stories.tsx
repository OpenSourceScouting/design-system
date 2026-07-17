import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, CardHeader, CardFooter, CardEyebrow } from "./Card";
import { Heading } from "./Heading";
import { Button } from "./Button";
import { PROGRAMS, PROGRAM_META, ScoutThemeProvider } from "../lib/theme/ScoutThemeProvider";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  argTypes: {
    variant: { control: "select", options: ["flat", "outlined", "elevated"] },
    featured: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Outlined: Story = {
  args: { variant: "outlined" },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardBody>
        <CardEyebrow>Camping</CardEyebrow>
        <Heading level={3} size={4}>
          Pinewood Derby Weekend
        </Heading>
        <p className="mt-2 font-body text-sm leading-relaxed text-program-on-surface/80">
          Build, race, and cheer on your custom car. Pack 42 hosts the annual race in the troop
          hall.
        </p>
      </CardBody>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { variant: "elevated", featured: true },
  render: Outlined.render,
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-md">
      <CardHeader>
        <Heading level={3} size={5}>
          Troop 7: Weekly Meeting
        </Heading>
      </CardHeader>
      <CardBody>
        <p className="font-body text-sm leading-relaxed text-program-on-surface/80">
          Plan your patrol's role in the upcoming service project. Bring your handbook.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="primary">
          RSVP
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * CardEyebrow is an editorial kicker riding a bottom keyline. The keyline
 * inherits `--program-rule-weight`, so the same component renders a 3px chunky
 * rule for Cub Scouts, 2px for Scouts BSA and Venturing, and a 1px drafted
 * hairline for Sea Scouts, with no per-program branching in the component. Each
 * panel below forces its own program theme to show the four weights side by
 * side regardless of the toolbar selection.
 */
export const EyebrowKeylineAcrossPrograms: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
      {PROGRAMS.map((p) => (
        <ScoutThemeProvider key={p} program={p}>
          <Card variant="outlined">
            <CardBody>
              <CardEyebrow>{PROGRAM_META[p].label}</CardEyebrow>
              <Heading level={3} size={4}>
                Lead Adventure of the Month
              </Heading>
              <p className="mt-2 font-body text-sm leading-relaxed text-program-on-surface/80">
                Notice the keyline weight under the kicker: {PROGRAM_META[p].label} sets{" "}
                <code className="font-mono text-xs">--program-rule-weight</code> to its own value.
              </p>
            </CardBody>
          </Card>
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};
