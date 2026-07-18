import type { Meta, StoryObj } from "@storybook/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./NavigationMenu";

const meta: Meta<typeof NavigationMenu> = {
  title: "Navigation/NavigationMenu",
  component: NavigationMenu,
};
export default meta;
type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[20rem] gap-1">
              {["Cub Scouts", "Scouts BSA", "Venturing", "Sea Scouts"].map((p) => (
                <li key={p}>
                  <NavigationMenuLink
                    href="#"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {p}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Events
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
