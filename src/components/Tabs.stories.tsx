import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[28rem]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="packing">Packing list</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-foreground/85">
        A weekend of outdoor skills, campfire programs, and advancement.
      </TabsContent>
      <TabsContent value="schedule" className="text-sm text-foreground/85">
        Check-in Friday 5 PM; closing ceremony Sunday 10 AM.
      </TabsContent>
      <TabsContent value="packing" className="text-sm text-foreground/85">
        Tent, sleeping bag, mess kit, rain gear, full water bottle.
      </TabsContent>
    </Tabs>
  ),
};
