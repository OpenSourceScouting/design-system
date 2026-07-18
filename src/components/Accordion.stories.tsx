import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Navigation/Accordion",
  component: Accordion,
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[28rem]">
      <AccordionItem value="cost">
        <AccordionTrigger>How much does it cost?</AccordionTrigger>
        <AccordionContent>
          Registration is $25 per scout and covers meals and the event patch.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="who">
        <AccordionTrigger>Who can attend?</AccordionTrigger>
        <AccordionContent>
          All registered scouts and their leaders. Family camping is available Saturday night.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="refund">
        <AccordionTrigger>What is the refund policy?</AccordionTrigger>
        <AccordionContent>
          Full refunds are available up to one week before the event.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
