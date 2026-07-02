import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, CardHeader, CardFooter, CardEyebrow } from "./Card";
import { Heading } from "./Heading";
import { Button } from "./Button";

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
        <Heading level={3} size={4}>Pinewood Derby Weekend</Heading>
        <p className="mt-2 font-body text-sm leading-relaxed text-program-on-surface/80">
          Build, race, and cheer on your custom car. Pack 42 hosts the annual race in the troop hall.
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
        <Heading level={3} size={5}>Troop 7: Weekly Meeting</Heading>
      </CardHeader>
      <CardBody>
        <p className="font-body text-sm leading-relaxed text-program-on-surface/80">
          Plan your patrol's role in the upcoming service project. Bring your handbook.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="primary">RSVP</Button>
      </CardFooter>
    </Card>
  ),
};
