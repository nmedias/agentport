import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

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
// The radix checkbox docs ship no Choice Card example — ChoiceCard below is
// DS-authored for parity with the Switch/RadioGroup choice cards, reusing the same
// FieldLabel-wraps-Field branch (copy from shadcn's own new-york-v4 checkbox-demo).
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { checked: true, disabled: false },
  // Curated prop docs for the Autodocs ArgsTable — react-docgen can't extract props from
  // `ComponentProps<typeof CheckboxPrimitive.Root>` (a Radix type reference), so the public
  // API is documented here by hand. Interactive stories scope their panel via controls.include.
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled checked state (pair with `onCheckedChange`). Accepts `"indeterminate"`.',
      table: { type: { summary: 'boolean | "indeterminate"' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Checked state when uncontrolled.',
      table: { type: { summary: 'boolean | "indeterminate"' }, defaultValue: { summary: 'false' } },
    },
    onCheckedChange: {
      control: false,
      description: 'Called when the checked state changes.',
      table: { type: { summary: '(checked: boolean | "indeterminate") => void' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and dims the control (and its Field label via group styling).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the control required for native form validation.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'Form field name submitted with the form.',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Value submitted when checked.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '"on"' } },
    },
  },
  parameters: {
    docs: { source: { type: 'code' } },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Bare checkbox — the API playground. With `component: Checkbox` and no custom render,
// Storybook auto-renders <Checkbox {...args} />, so every prop documented in the meta
// argTypes shows in the ArgsTable AND as a live control (no controls.include — that would
// also filter the table). source.type:'dynamic' overrides the meta's 'code' so the snippet
// shows the generated <Checkbox …/> (reflecting the controls) instead of the literal `{}`.
// The Field-composed examples + the pseudo-state preview live in the stories below.
export const Default: Story = {

  render: (args) => <Checkbox {...args} />,
};

// docs "Basic": checkbox + label on one row via a horizontal Field.
// Interaction test — drives the checkbox like a user. The play function IS the body of
// this story's Vitest browser test, and it also animates step-by-step in the Interactions
// tab. Uncontrolled checkbox (Radix toggles itself on click); we query by role + accessible
// name (the FieldLabel's htmlFor gives the box its name) and assert the aria-checked outcome.

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox id="terms"  />
      <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
    </Field>
  ),
  play: async ({ canvas, step }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /accept terms/i });

    await step('starts unchecked', async () => {
      await expect(checkbox).not.toBeChecked();
    });

    await step('clicking toggles it on', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    // userEvent.click leaves the box programmatically focused (→ :focus-visible ring);
    // blur() drops the focus so the end state matches a real mouse user (no ring).
    await step('blurring clears the focus', async () => {
      checkbox.blur();
      await expect(checkbox).not.toHaveFocus();
    });
  },
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
// Figma .Checkbox variant set (checked × state). The focus rows force :focus-visible
// via the pseudo-states addon, so the focus ring — and the focus-gated invalid red
// ring (invalid alone shows only the destructive border) — is visible statically.
export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#s-checked-focus', '#s-focus-invalid'] },
  },
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
        <Checkbox id="s-checked-focus" defaultChecked />
        <Label htmlFor="s-checked-focus">Checked + focus</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-disabled" disabled />
        <Label htmlFor="s-disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-checked-disabled" defaultChecked disabled />
        <Label htmlFor="s-checked-disabled">Checked + disabled</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-invalid" aria-invalid />
        <Label htmlFor="s-invalid">Invalid (unchecked)</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-checked-invalid" defaultChecked aria-invalid />
        <Label htmlFor="s-checked-invalid">Checked + invalid</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-focus-invalid" aria-invalid />
        <Label htmlFor="s-focus-invalid">Invalid + focus</Label>
      </div>
    </div>
  ),
};
