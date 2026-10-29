import type { Meta, StoryObj } from "@storybook/react-vite";
import { PROGRAMS, PROGRAM_META, ScoutThemeProvider } from "../lib/theme/ScoutThemeProvider";

/**
 * Document styles (`print.css`): long-form prose for rendered Markdown and PDFs.
 *
 * The markup below is the shape a Markdown-to-HTML converter (remark-gfm,
 * markdown-it) emits: bare headings, lists, a GFM task list, a blockquote,
 * code, a table, and footnotes, all inside one `.os-document` wrapper. The
 * stylesheet is plain CSS over the token variables, so the same document
 * re-themes per program.
 *
 * Like the Contrast Kitchen Sink, these stories turn axe `color-contrast` back
 * ON, so the browser test run fails if any document text renders below AA in
 * any program.
 */
const meta: Meta = {
  title: "Foundations/Document",
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function SampleDocument({ title }: { title: string }) {
  return (
    <article className="os-document">
      <h1>{title}</h1>
      <p>
        This page shows how a Markdown file renders through <code>print.css</code>. Body copy uses
        the program&apos;s body face, and <a href="https://example.org/calendar">links</a> pick up
        the primary color. <strong>Bold</strong> and <em>italic</em> text work as expected.
      </p>

      <h2>Before the campout</h2>
      <p>Every family should confirm the following by Friday:</p>
      <ul>
        <li>Permission slip signed and returned</li>
        <li>
          Gear checked against the packing list
          <ul>
            <li>Sleeping bag rated to 30°F</li>
            <li>Rain jacket</li>
          </ul>
        </li>
        <li>Medical form on file</li>
      </ul>
      <ol>
        <li>Meet at the service center at 5:30 PM.</li>
        <li>Load gear by patrol.</li>
        <li>Depart at 6:00 PM sharp.</li>
      </ol>

      <h3>Task list</h3>
      {/* Recommended renderer output: remark-gfm emits an unlabeled checkbox,
          which fails axe "label"; wrapping it in <label> fixes that. */}
      <ul className="contains-task-list">
        <li className="task-list-item">
          <label>
            <input type="checkbox" checked disabled /> Reserve campsite
          </label>
        </li>
        <li className="task-list-item">
          <label>
            <input type="checkbox" disabled /> Finalize menu
          </label>
        </li>
      </ul>

      <blockquote>
        <p>
          Leave every campsite better than you found it. Pack out what you pack in, and then some.
        </p>
      </blockquote>

      <h2>Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Activity</th>
            <th>Lead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>7:00 AM</td>
            <td>Breakfast and cleanup</td>
            <td>Patrol cooks</td>
          </tr>
          <tr>
            <td>9:00 AM</td>
            <td>Orienteering course</td>
            <td>Senior patrol leader</td>
          </tr>
          <tr>
            <td>1:00 PM</td>
            <td>Service project</td>
            <td>Committee chair</td>
          </tr>
        </tbody>
      </table>

      <h3>Sign-up script</h3>
      <pre>
        <code>{`npx scout-pdf campout.md --program scouting -o campout.pdf`}</code>
      </pre>

      <hr />

      <p>
        Questions go to the unit leader.
        <sup>
          <a href="#fn-1" id="fnref-1" aria-describedby="footnote-label">
            1
          </a>
        </sup>
      </p>

      <section data-footnotes className="footnotes">
        <h2 id="footnote-label">Footnotes</h2>
        <ol>
          <li id="fn-1">
            <p>
              Contact details are in the unit roster. <a href="#fnref-1">Back to reference</a>
            </p>
          </li>
        </ol>
      </section>
    </article>
  );
}

/** The full sample in the program selected in the toolbar. */
export const Default: Story = {
  render: () => <SampleDocument title="Fall Campout Packet" />,
};

/**
 * One document per program, scanned for color contrast in a single axe pass.
 * Each panel re-binds the tokens via its own provider.
 */
export const AllPrograms: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      {PROGRAMS.map((program) => (
        <ScoutThemeProvider
          key={program}
          program={program}
          className="border border-border p-6 bg-background"
        >
          <SampleDocument title={PROGRAM_META[program].label} />
        </ScoutThemeProvider>
      ))}
    </div>
  ),
};
