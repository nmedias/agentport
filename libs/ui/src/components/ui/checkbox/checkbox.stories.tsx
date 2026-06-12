import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './checkbox';
import { Label } from '../label';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../field';

// Usage examples mirror ui.shadcn.com/docs/components/radix/checkbox, which composes
// the checkbox with the ported Field family (Field / FieldGroup / FieldSet), not a
// bare div + Label. Skipped (un-ported dep / locale): the docs "Table" example
// (needs the un-ported Table component) and the "RTL" Arabic locale demo.
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Bare box — the args control checked/disabled (the docs "Checked" controlled usage).
export const Default: Story = {};

// docs "Basic": checkbox + label on one row via a horizontal Field.
export const Basic: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox id="terms" defaultChecked />
      <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
    </Field>
  ),
};

// docs "Description": label + helper text stacked in a FieldContent column.
export const Description: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id="terms-2" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
};

// docs "Group": a checkbox list grouped under a FieldSet + FieldLegend.
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label">Sidebar</FieldLegend>
      <FieldDescription>Select the items to show in the sidebar.</FieldDescription>
      <FieldGroup>
        <Field orientation="horizontal">
          <Checkbox id="recents" defaultChecked />
          <FieldLabel htmlFor="recents">Recents</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="home" defaultChecked />
          <FieldLabel htmlFor="home">Home</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="applications" />
          <FieldLabel htmlFor="applications">Applications</FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

// docs "Disabled": disabled prop on the Checkbox + data-disabled on the Field
// (the Field dims the label alongside the box).
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" data-disabled="true" className="max-w-sm">
      <Checkbox id="terms-disabled" disabled />
      <FieldLabel htmlFor="terms-disabled">Accept terms and conditions</FieldLabel>
    </Field>
  ),
};

// docs "Invalid": aria-invalid on the Checkbox + data-invalid on the Field + FieldError.
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" data-invalid className="max-w-sm">
      <Checkbox id="terms-invalid" aria-invalid />
      <FieldContent>
        <FieldLabel htmlFor="terms-invalid">Accept terms and conditions</FieldLabel>
        <FieldError>You must accept the terms and conditions to continue.</FieldError>
      </FieldContent>
    </Field>
  ),
};

// DS-authored (no standalone doc example): every state side by side, mirroring the
// Figma .Checkbox variant set. Focus is a live pseudo-state (focus ring on tab-in).
export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center gap-lg">
        <Checkbox id="s-default" />
        <Label htmlFor="s-default">Default (unchecked)</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-checked" defaultChecked />
        <Label htmlFor="s-checked">Checked</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-disabled" disabled />
        <Label htmlFor="s-disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-invalid" aria-invalid />
        <Label htmlFor="s-invalid">Invalid (unchecked)</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-checked-invalid" defaultChecked aria-invalid />
        <Label htmlFor="s-checked-invalid">Checked + invalid</Label>
      </div>
    </div>
  ),
};
