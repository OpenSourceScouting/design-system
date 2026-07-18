import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./AlertDialog";
import { Button } from "./Button";

const meta: Meta<typeof AlertDialog> = {
  title: "Overlays/AlertDialog",
  component: AlertDialog,
};
export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Cancel registration</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this registration?</AlertDialogTitle>
          <AlertDialogDescription>
            This releases your reserved spots. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep registration</AlertDialogCancel>
          <AlertDialogAction>Yes, cancel</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
