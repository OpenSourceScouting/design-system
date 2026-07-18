import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";
import { TextInput } from "./TextInput";

const meta: Meta<typeof Field> = {
  title: "Forms/Field",
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "Field wraps a control with a label, help text, and error message, and wires " +
          "id / aria-describedby / aria-invalid automatically for the control inside it.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field label="Email" help="We only use it for event reminders." required>
        <TextInput type="email" placeholder="scout@example.org" />
      </Field>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field label="Email" error="Enter a valid email address." required>
        <TextInput type="email" defaultValue="not-an-email" />
      </Field>
    </div>
  ),
};
