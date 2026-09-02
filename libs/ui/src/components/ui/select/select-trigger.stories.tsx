import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Second Autodocs page for the trigger primitive (the UI/Select page documents the value-driven Select
// root). meta.component = SelectTrigger → its own ArgsTable; `size`/`disabled` come from SelectTriggerProps'
// JSDoc via react-docgen (see select.tsx), so they're live controls here, not just doc rows. A SelectTrigger
// needs a Select ancestor + a SelectContent to open, so every render wraps it.
const meta: Meta<typeof SelectTrigger> = {
  title: 'UI/Select/SelectTrigger',
  component: SelectTrigger,
  tags: ['autodocs'],
  args: { size: 'default', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'], table: { defaultValue: { summary: '"default"' } } },
    disabled: { table: { defaultValue: { summary: 'false' } } },
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
          'The closed combobox button of a `Select` — it reads like the sibling text fields and carries the field states; `size` (`sm`/`default`) matches the input scale. Must live inside a Select. The container API lives on the [`UI/Select`](?path=/docs/ui-select--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectTrigger>;

// API playground — the trigger inside a working Select. size + disabled are live controls + ArgsTable rows.
// The play asserts the size reflects on data-size and the enabled trigger opens.
export const Default: Story = {
  render: ({ size, disabled }) => (
    <Select>
      <SelectTrigger aria-label="Favorite fruit" className="w-50" size={size} disabled={disabled}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /favorite fruit/i });
    await step('reflects the size on data-size', async () => {
      await expect(trigger).toHaveAttribute('data-size', 'default');
    });
    await step('the enabled trigger opens', async () => {
      await userEvent.click(trigger);
      await expect(await screen.findByRole('listbox')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
    });
  },
};
