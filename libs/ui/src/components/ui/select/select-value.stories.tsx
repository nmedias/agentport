import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Second Autodocs page for the value primitive. meta.component = SelectValue → its own ArgsTable;
// `placeholder` comes from SelectValueProps' JSDoc via react-docgen (see select.tsx). SelectValue renders
// inside the trigger and needs a Select ancestor, so every render wraps it.
const meta: Meta<typeof SelectValue> = {
  title: 'UI/Select/SelectValue',
  component: SelectValue,
  tags: ['autodocs'],
  args: { placeholder: 'Select a fruit' },
  argTypes: {
    placeholder: { control: 'text', table: { defaultValue: { summary: '—' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The value display inside a `SelectTrigger` — shows the chosen option\'s content, or the dimmed `placeholder` while nothing is selected. Must live inside a Select. The container API lives on the [`UI/Select`](?path=/docs/ui-select--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectValue>;

// API playground — the empty trigger showing the placeholder. The play asserts the placeholder renders.
export const Default: Story = {
  render: ({ placeholder }) => (
    <Select>
      <SelectTrigger aria-label="Empty value" className="w-50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /empty value/i });
    await step('shows the placeholder while empty', async () => {
      await expect(trigger).toHaveTextContent('Select a fruit');
    });
  },
};
