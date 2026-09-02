import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './field';
import { Input } from '../input';

// Second Autodocs page for the group container (the UI/Field page documents the per-row Field).
// meta.component = FieldGroup → its own ArgsTable; `orientation` comes from FieldGroupProps' JSDoc via
// react-docgen (see field.tsx), so it's a LIVE control here. A DS extension over stock shadcn (which only
// gives Field an orientation): the GROUP lays its Fields vertically (default) or in a wrapping row — the
// row axis the checkbox/radio groups build on. Display-only (no interaction) → no play; wraps in FieldSet
// for a realistic caption.
const meta: Meta<typeof FieldGroup> = {
  title: 'UI/Field/FieldGroup',
  component: FieldGroup,
  tags: ['autodocs'],
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: { defaultValue: { summary: '"vertical"' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'Stacks several Fields with a consistent rhythm — vertically by default, or as a wrapping horizontal row: the layout that checkbox and radio groups build on.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FieldGroup>;

// API playground — a compact row of short number inputs; toggle `orientation` to reflow row↔stack live
// (each Field hugs to content in the row layout, so the inputs carry the width).
export const Default: Story = {
  render: ({ orientation }) => (
    <div className="w-full max-w-2xl">
      <FieldSet>
        <FieldLegend>Dimensions</FieldLegend>
        <FieldDescription>Set the artboard size in pixels.</FieldDescription>
        <FieldGroup orientation={orientation}>
          <Field>
            <FieldLabel htmlFor="dim-width">Width</FieldLabel>
            <Input id="dim-width" type="number" placeholder="1920" className="w-24" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dim-height">Height</FieldLabel>
            <Input id="dim-height" type="number" placeholder="1080" className="w-24" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dim-scale">Scale</FieldLabel>
            <Input id="dim-scale" type="number" placeholder="2" className="w-24" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};
