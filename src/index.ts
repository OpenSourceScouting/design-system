export {
  ScoutThemeProvider,
  useScoutTheme,
  useProgramStamp,
  PROGRAMS,
  PROGRAM_META,
} from "./lib/theme/ScoutThemeProvider";
export type { Program, ScoutThemeProviderProps } from "./lib/theme/ScoutThemeProvider";

export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button";

export { Card, CardBody, CardHeader, CardFooter, CardEyebrow } from "./components/Card";
export type { CardProps } from "./components/Card";

export { Badge } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";

export { Heading } from "./components/Heading";
export type { HeadingProps } from "./components/Heading";

export { Alert } from "./components/Alert";
export type { AlertProps } from "./components/Alert";

export { ProgramMark } from "./components/ProgramMark";
export type { ProgramMarkProps, ProgramMarkVariant } from "./components/ProgramMark";

export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";

export { ProgramIcon, PROGRAM_ICONS } from "./components/ProgramIcon";
export type { ProgramIconProps } from "./components/ProgramIcon";

export { ScoutingAmericaWordmark } from "./components/ScoutingAmericaWordmark";
export type {
  ScoutingAmericaWordmarkProps,
  ScoutingAmericaWordmarkOrientation,
  ScoutingAmericaWordmarkVariant,
} from "./components/ScoutingAmericaWordmark";

export { DecorativeDivider } from "./components/DecorativeDivider";
export type { DecorativeDividerProps } from "./components/DecorativeDivider";

export { ProgramHero } from "./components/ProgramHero";
export type { ProgramHeroProps } from "./components/ProgramHero";

export { FeatureGrid } from "./components/FeatureGrid";
export type { FeatureGridProps, Feature } from "./components/FeatureGrid";

export { EventCard } from "./components/EventCard";
export type { EventCardProps } from "./components/EventCard";

export { RegistrationCTA } from "./components/RegistrationCTA";
export type { RegistrationCTAProps } from "./components/RegistrationCTA";

export { Calendar } from "./components/Calendar";
export type { CalendarProps, CalendarEvent, CalendarView } from "./components/Calendar";

export {
  EventDialog,
  EventDialogHeader,
  EventDialogBody,
  EventDialogFooter,
} from "./components/EventDialog";
export type {
  EventDialogProps,
  EventDialogAction,
  EventDialogHeaderProps,
  EventDialogBodyProps,
  EventDialogFooterProps,
} from "./components/EventDialog";

// Form layer
export { Field, useFieldContext, controlClasses } from "./components/Field";
export type { FieldProps } from "./components/Field";
export { TextInput } from "./components/TextInput";
export type { TextInputProps } from "./components/TextInput";
export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";
export { Select, SelectItem } from "./components/Select";
export type { SelectProps, SelectItemProps } from "./components/Select";
export { NativeSelect } from "./components/NativeSelect";
export type { NativeSelectProps } from "./components/NativeSelect";
export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";
export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";
export { RadioGroup, Radio } from "./components/RadioGroup";
export type { RadioGroupProps, RadioProps } from "./components/RadioGroup";

// Tier-1 overlay widgets (shadcn recipes on Radix)
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/Dialog";
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./components/AlertDialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./components/DropdownMenu";
export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from "./components/Popover";
export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./components/Tooltip";

// Tier-1 structural widgets (shadcn recipes on Radix)
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/Accordion";
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from "./components/NavigationMenu";

export { MadeWithBadge } from "./components/MadeWithBadge";
export type {
  MadeWithBadgeProps,
  MadeWithBadgeVariant,
  MadeWithBadgeSize,
} from "./components/MadeWithBadge";

// Canonical Scouting America resource links (authoritative external URLs).
export { SCOUTING_LINKS, SCOUTING_LINK_LIST } from "./lib/links";
export type { ScoutingLink, ScoutingLinkKey } from "./lib/links";

export { cn } from "./lib/utils/cn";
