import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from '../label';

// Second Autodocs page for the option primitive. The UI/RadioGroup page documents the
// value-driven container; this page (UI/RadioGroup/Item) gives RadioGroupItem its own
// real ArgsTable instead of a prose block in the container's description. Same curation
// reason as the container: react-docgen can't extract props from
// `ComponentProps<typeof RadioGroupPrimitive.Item>` (a Radix type reference), so the
// public API is documented here by hand. A RadioGroupItem needs a RadioGroup ancestor
// (Radix context), so every render wraps it.
const meta: Meta<typeof RadioGroupItem> = {
  title: 'UI/RadioGroup/Item',
  component: RadioGroupItem,
  tags: ['autodocs'],
  args: { value: 'option', disabled: false },
  argTypes: {
    value: {
      control: 'text',
      description: 'Value selected (and form-submitted) when this item is chosen.',
      type: { name: 'string', required: true },
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables just this item. (The whole group can be disabled via `RadioGroup`.)',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    id: {
      control: 'text',
      description: 'Pairs the item with a `<label htmlFor>` for an accessible name.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A single option inside a **`RadioGroup`** — Radix requires the group ancestor, so every example wraps it. The value-driven container API lives on the [`UI/RadioGroup`](?path=/docs/ui-radiogroup--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroupItem>;

// API playground — one labeled item inside a RadioGroup. Renders <RadioGroupItem {...args}>
// so every documented prop shows in the ArgsTable AND as a live control. defaultValue
// tracks the item's value so the playground item reads as selected.
export const Default: Story = {
  render: ({ id = 'rgi-default', value, ...args }) => (
    <RadioGroup defaultValue={value} className="max-w-sm">
      <div className="flex items-center gap-lg">
        <RadioGroupItem id={id} value={value} {...args} />
        <Label htmlFor={id}>{value}</Label>
      </div>
    </RadioGroup>
  ),
};
