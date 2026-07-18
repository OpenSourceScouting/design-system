import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect } from "./NativeSelect";

const meta: Meta<typeof NativeSelect> = {
  title: "Forms/NativeSelect",
  component: NativeSelect,
};
export default meta;

type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      {/* NativeSelect is normally wrapped in <Field>, which supplies the label.
          In this bare demo, give it an accessible name directly. */}
      <NativeSelect aria-label="Program" defaultValue="cub">
        <option value="cub">Cub Scouts</option>
        <option value="scoutsbsa">Scouts BSA</option>
        <option value="venturing">Venturing</option>
        <option value="seascouts">Sea Scouts</option>
      </NativeSelect>
    </div>
  ),
};
