import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './field';
import { Input } from '../input';

// Second Autodocs page for the fieldset caption. meta.component = FieldLegend → its own ArgsTable;
// `variant` comes from FieldLegendProps' JSDoc via react-docgen (see field.tsx) — a live control. A
// <legend> must live in a <fieldset>, so every render wraps it in FieldSet. Display-only → no play.
const meta: Meta<typeof FieldLegend> = {
  title: 'UI/Field/FieldLegend',
  component: FieldLegend,
  tags: ['autodocs'],
  args: { variant: 'legend' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['legend', 'label'],
      table: { defaultValue: { summary: '"legend"' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The caption of a FieldSet: `legend` for a section title, `label` as the lighter form for nested sub-groups.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FieldLegend>;

// API playground — the legend captioning a fieldset; toggle `variant` between the section-title weight and
// the lighter label weight.
export const Default: Story = {
  render: ({ variant }) => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLegend variant={variant}>Address Information</FieldLegend>
        <FieldDescription>We need your address to deliver your order.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="legend-street">Street Address</FieldLabel>
            <Input id="legend-street" type="text" placeholder="123 Main St" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};
