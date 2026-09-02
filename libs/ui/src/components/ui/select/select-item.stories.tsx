import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Second Autodocs page for the option primitive. meta.component = SelectItem → its own ArgsTable;
// `value` (required) / `disabled` / `textValue` come from SelectItemProps' JSDoc via react-docgen (see
// select.tsx). `textValue` stays in the table but its control is disabled — its typeahead effect is
// invisible and a no-op with plain-text children; the Typeahead story below proves it where it matters.
// A SelectItem needs a Select ancestor, so every render wraps it.
const meta: Meta<typeof SelectItem> = {
  title: 'UI/Select/SelectItem',
  component: SelectItem,
  tags: ['autodocs'],
  args: { value: 'cherry', disabled: false },
  argTypes: {
    value: { table: { defaultValue: { summary: '—' } } },
    disabled: { table: { defaultValue: { summary: 'false' } } },
    // Documented (ArgsTable row from docgen) but not an interactive control — see the Typeahead story.
    textValue: { control: false },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8189-3667',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'One option inside a `Select` — `value` is what the group reports; `textValue` supplies the typeahead text when the children are not plain text. Must live inside a Select. The container API lives on the [`UI/Select`](?path=/docs/ui-select--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectItem>;

// API playground — one driven item (value + disabled live) among static siblings. The play opens the
// listbox and selects the driven item, asserting its label lands on the trigger.
export const Default: Story = {
  render: ({ value, disabled }) => (
    <Select>
      <SelectTrigger aria-label="Item options" className="w-50">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value={value} disabled={disabled}>
          Cherry
        </SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /item options/i });
    await step('opens the listbox', async () => {
      await userEvent.click(trigger);
      await expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });
    await step('selecting the driven item updates the trigger', async () => {
      await userEvent.click(await screen.findByRole('option', { name: 'Cherry' }));
      await expect(trigger).toHaveTextContent('Cherry');
    });
  },
};

// Typeahead — where `textValue` earns its place: each option leads with an aria-hidden flag emoji, so its
// text CONTENT starts with the emoji, not the country name → Radix's derived typeahead (match-from-start)
// wouldn't find "portugal". `textValue="Portugal"` restores type-to-select. The play focuses the CLOSED
// trigger (Radix selects on type, like a native <select>) and types to jump — the behaviour proof a
// control can't give, which is why textValue is documented but not a control above.
export const Typeahead: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Select>
      <SelectTrigger aria-label="Country" className="w-60">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="de" textValue="Germany">
          <span aria-hidden>🇩🇪</span> Germany
        </SelectItem>
        <SelectItem value="fr" textValue="France">
          <span aria-hidden>🇫🇷</span> France
        </SelectItem>
        <SelectItem value="pt" textValue="Portugal">
          <span aria-hidden>🇵🇹</span> Portugal
        </SelectItem>
        <SelectItem value="jp" textValue="Japan">
          <span aria-hidden>🇯🇵</span> Japan
        </SelectItem>
        <SelectItem value="br" textValue="Brazil">
          <span aria-hidden>🇧🇷</span> Brazil
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /country/i });
    await step('typing on the focused trigger jumps to the textValue match', async () => {
      trigger.focus();
      await userEvent.keyboard('portugal');
      await expect(trigger).toHaveTextContent('Portugal');
    });
    // userEvent leaves the trigger focused; blur so the end state matches a real mouse user.
    await step('blurring clears the focus', async () => {
      trigger.blur();
      await expect(trigger).not.toHaveFocus();
    });
  },
};
