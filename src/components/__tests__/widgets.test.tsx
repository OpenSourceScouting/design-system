import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderThemed } from "./testUtils";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../Tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../Accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../Dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../AlertDialog";
import { Popover, PopoverTrigger, PopoverContent } from "../Popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../DropdownMenu";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../Tooltip";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../NavigationMenu";

/**
 * Accessibility smoke tests for the Tier-1 widgets (the form controls are
 * covered in forms.test.tsx). Portalled widgets are opened with `defaultOpen`
 * and scanned at document.body, where Radix renders the portal.
 *
 * The `region` rule ("all page content must be in a landmark") is disabled: it
 * is a page-structure best practice, and these tests render isolated widgets
 * with no surrounding <main>/<nav>. A real page provides the landmarks.
 */
const a11y = (el: Element) => axe(el, { rules: { region: { enabled: false } } });
describe("Tabs", () => {
  it("has no axe violations", async () => {
    const { container } = renderThemed(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Overview</TabsTrigger>
          <TabsTrigger value="b">Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Overview content</TabsContent>
        <TabsContent value="b">Schedule content</TabsContent>
      </Tabs>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe("Accordion", () => {
  it("has no axe violations", async () => {
    const { container } = renderThemed(
      <Accordion type="single" collapsible defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Question one</AccordionTrigger>
          <AccordionContent>Answer one</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});

describe("Dialog", () => {
  it("has no axe violations when open", async () => {
    renderThemed(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
            <DialogDescription>Confirm your attendance.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

describe("AlertDialog", () => {
  it("has no axe violations when open", async () => {
    renderThemed(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel registration?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction>Cancel it</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

describe("Popover", () => {
  it("has no axe violations when open", async () => {
    renderThemed(
      <Popover defaultOpen>
        <PopoverTrigger>Details</PopoverTrigger>
        {/* Radix PopoverContent is role="dialog" and needs an accessible name;
            axe caught this, so label it (correct usage, matches stock shadcn). */}
        <PopoverContent aria-label="Trip details">Gather at the trailhead by 8 AM.</PopoverContent>
      </Popover>,
    );
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

describe("DropdownMenu", () => {
  it("has no axe violations when open", async () => {
    renderThemed(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Event</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Register</DropdownMenuItem>
          <DropdownMenuItem>Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

describe("Tooltip", () => {
  it("has no axe violations when open", async () => {
    renderThemed(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Opens the registration form</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(await a11y(document.body)).toHaveNoViolations();
  });
});

describe("NavigationMenu", () => {
  it("has no axe violations", async () => {
    const { container } = renderThemed(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Events
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(await a11y(container)).toHaveNoViolations();
  });
});
