import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from '../label';

// Second Autodocs page for the option primitive. The UI/RadioGroup page documents the
// value-driven container; this page (UI/RadioGroup/Item) gives RadioGroupItem its own
// real ArgsTable. Prop type · description · enum · the required `value` come from
// RadioGroupItemProps' JSDoc via react-docgen (see radio-group.tsx); Storybook infers
// each control from the type. argTypes adds only the defaultValue for the defaulted
// `disabled` (the ArgsTable Default column ignores the @default JSDoc tag). A
// RadioGroupItem needs a RadioGroup ancestor (Radix context), so every render wraps it.
const meta: Meta<typeof RadioGroupItem> = {
  title: 'UI/RadioGroup/Item',
  component: RadioGroupItem,
  tags: ['autodocs'],
  args: { value: 'option', disabled: false },
  argTypes: {
    disabled: { table: { defaultValue: { summary: 'false' } } },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8298-4626',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'One option inside a `RadioGroup`: it renders the circle and its states, while name, value and selection live on the group — it cannot be used outside one. The group API lives on the [`UI/RadioGroup`](?path=/docs/ui-radiogroup--docs) page.',
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
