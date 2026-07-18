import type { Meta, StoryObj } from "@storybook/react-vite";
import { PROGRAMS, PROGRAM_META, ScoutThemeProvider } from "../lib/theme/ScoutThemeProvider";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

/**
 * Rendered-contrast guard (ADR 0005, layer 1b).
 *
 * `tests/contrast.test.ts` proves the token PALETTE is WCAG AA. It does not
 * render a single component, so it cannot prove a component APPLIES the right
 * token. This story closes that gap: it renders a representative set of
 * components and text-on-surface pairs under each program theme and turns the
 * axe `color-contrast` rule back ON (it is disabled globally in
 * `.storybook/preview.tsx`). The @storybook/addon-vitest browser run then fails
 * if any of these render below AA in any program.
 *
 * Deliberately curated to text that MUST meet 4.5:1 at its rendered size:
 * `text-foreground`, `text-muted-foreground`, `text-primary-foreground`, and
 * `text-os-on-primary-soft`, plus filled Buttons/Badges at default size. It
 * intentionally OMITS `text-os-on-surface-faint` (designed for 3:1, so axe would
 * correctly flag it at normal size) and `accent size="sm"` (blocked by design),
 * so a failure here means a real misapplication or a token regression, not a
 * by-design case.
 */
const meta: Meta = {
  title: "Foundations/Contrast Kitchen Sink",
  parameters: {
    // Re-enable color-contrast for this story only (the array replaces the
    // global rules entry, while a11y.test="error" is inherited from preview).
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};
export default meta;

type Story = StoryObj;

function ProgramSwatch({ program }: { program: (typeof PROGRAMS)[number] }) {
  return (
    <ScoutThemeProvider program={program}>
      <section
        data-testid={`contrast-${program}`}
        className="bg-background text-foreground space-y-3 rounded-lg p-6"
      >
        <h3 className="display text-lg font-semibold">{PROGRAM_META[program].label}</h3>
        <p className="text-foreground">Foreground body text on the surface.</p>
        <p className="text-muted-foreground">Muted body text (must stay AA).</p>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="subtle">Subtle</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>

        <div className="bg-primary space-y-1 rounded-lg p-4">
          <p className="text-primary-foreground">Text on the primary surface.</p>
          <p className="text-os-on-primary-soft">Soft text on primary (must stay AA).</p>
        </div>
      </section>
    </ScoutThemeProvider>
  );
}

/**
 * Every program's rendered contrast, scanned in one axe pass. Nested
 * ScoutThemeProviders re-bind the tokens per block, so a single story covers all
 * four program palettes (the parent brand :root palette is covered by the token
 * test).
 */
export const AllPrograms: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      {PROGRAMS.map((program) => (
        <ProgramSwatch key={program} program={program} />
      ))}
    </div>
  ),
};
