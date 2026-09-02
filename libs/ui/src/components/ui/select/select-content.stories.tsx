import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Second Autodocs page for the dropdown primitive. meta.component = SelectContent → its own ArgsTable;
// `position`/`align` come from SelectContentProps' JSDoc via react-docgen (see select.tsx). SelectContent
// portals + needs a Select ancestor + a trigger to open, so every render wraps it and the play opens it.
const meta: Meta<typeof SelectContent> = {
  title: 'UI/Select/SelectContent',
  component: SelectContent,
  tags: ['autodocs'],
  args: { position: 'item-aligned', align: 'center' },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['item-aligned', 'popper'],
      table: { defaultValue: { summary: '"item-aligned"' } },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: '"center"' } },
    },
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
          'The dropdown of a `Select`, mounted only while open. `position` chooses the strategy: `item-aligned` overlays the selected option onto the trigger, `popper` anchors the list below/above (then `align` applies). The container API lives on the [`UI/Select`](?path=/docs/ui-select--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectContent>;

// API playground — toggle position/align, open the dropdown to see the placement. The play opens it and
// asserts the listbox mounts, then closes on Escape (focus back on the trigger).
export const Default: Story = {
  render: ({ position, align }) => (
    <Select>
      <SelectTrigger aria-label="Dropdown position" className="w-50">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent position={position} align={align}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /dropdown position/i });
    await step('opens the dropdown', async () => {
      await userEvent.click(trigger);
      await expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });
    await step('closes on Escape, focus back on the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(trigger).toHaveFocus();
    });
  },
};
