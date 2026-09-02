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

// Checkbox contract — a Radix Root[role=checkbox] (data-slot="checkbox") whose box + check are pure
// CSS, not props: data-state=checked (or "indeterminate") paints the primary fill + check/dash icon
// (unchecked = the input-fill border box); focus-visible adds the border-ring + 3px ring; aria-invalid
// sets the destructive border + ring (red, focus-gated); disabled dims and dims its Field label via
// group styling. AllStates forces focus statically via the pseudo addon.
//
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
  // Prop type · description · enum come from the component's JSDoc via react-docgen (see
  // CheckboxProps in checkbox.tsx); Storybook infers each control from the type. argTypes adds:
  // control overrides for `onCheckedChange` (false — it's a callback); `checked` → an inline-radio
  // over the real union `false | true | 'indeterminate'`, so the tri-state (incl. indeterminate) is
  // reachable in the playground AND survives a URL/MCP `&args=checked:indeterminate` override — a
  // `boolean` toggle would coerce "indeterminate" → bool and the tri-state path would never render;
  // `defaultChecked` stays a `boolean` toggle (uncontrolled initial state; its union would otherwise
  // infer an object control). Plus a defaultValue per defaulted prop — the ArgsTable Default column
  // ignores the @default JSDoc tag, so every default is declared here (the component's @default tags
  // feed the storybook MCP get-documentation).
  argTypes: {
    checked: { control: 'inline-radio', options: [false, true, 'indeterminate'] },
    onCheckedChange: { control: false },
    defaultChecked: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    disabled: { table: { defaultValue: { summary: 'false' } } },
    required: { table: { defaultValue: { summary: 'false' } } },
    value: { table: { defaultValue: { summary: '"on"' } } },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8079-2759',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The binary choice control, with an explicit `"indeterminate"` for parent/group states. Checked, invalid, disabled and focus combine freely as live states. A bare box has no accessible name — it needs a Label/Field or an `aria-label`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Bare checkbox — the API playground. render spreads {...args} into a complete <Checkbox> (aria-label
// gives the otherwise-bare control an accessible name), so every prop in the meta argTypes is a live
// control AND an ArgsTable row (no controls.include — it would also filter the table) and the 'code'
// snippet is a real example, never an empty {}. The Field-composed examples + the pseudo-state preview
// live in the stories below.
export const Default: Story = {
  render: (args) => <Checkbox aria-label="Checkbox" {...args} />,
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

// DS-authored: the third checked state. Radix sets data-state="indeterminate" (and
// aria-checked="mixed") — the box gets the same primary fill as checked but shows a dash, not a
// check. Wired via defaultChecked so the tri-state renders on mount and bypasses the `checked` arg
// control. The play test pins the semantics with the jest-dom partial-checked matcher.
export const Indeterminate: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox id="terms-indeterminate" defaultChecked="indeterminate" />
      <FieldLabel htmlFor="terms-indeterminate">Select all items</FieldLabel>
    </Field>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /select all items/i });
    await expect(checkbox).toBePartiallyChecked();
  },
};

// docs "Group": a checkbox list grouped under a FieldSet + FieldLegend. The orientation
// control is wired to the FieldGroup container (a DS prop, not a Checkbox prop) — vertical
// stacks the options, horizontal lays them in a wrapping row. Typed on its own arg shape
// since orientation isn't part of the Checkbox API (the meta's component).
export const Group: StoryObj<{ orientation: 'vertical' | 'horizontal' }> = {
  args: { orientation: 'vertical' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout of the checkbox list — a `FieldGroup` prop (`vertical` stacks, `horizontal` rows).',
      table: { type: { summary: '"vertical" | "horizontal"' }, defaultValue: { summary: '"vertical"' } },
    },
  },
  parameters: { controls: { include: ['orientation'] } },
  render: ({ orientation }) => (
    <FieldSet className={orientation === 'horizontal' ? 'max-w-lg' : 'max-w-sm'}>
      <FieldLegend variant="label">Sidebar</FieldLegend>
      <FieldDescription>Select the items to show in the sidebar.</FieldDescription>
      <FieldGroup orientation={orientation}>
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

// DS-authored usage: a horizontal checkbox group — FieldGroup orientation="horizontal" lays
// the options in a wrapping row (each Field shrinks to content), e.g. a compact "which columns
// to show" toggle row. The static counterpart to the Group story's orientation control, and the
// checkbox parallel to RadioGroup's Horizontal story.
export const GroupHorizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldSet className="max-w-lg">
      <FieldLegend variant="label">Visible columns</FieldLegend>
      <FieldDescription>Choose which columns to show in the table.</FieldDescription>
      <FieldGroup orientation="horizontal">
        <Field orientation="horizontal">
          <Checkbox id="col-name" defaultChecked />
          <FieldLabel htmlFor="col-name">Name</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="col-type" defaultChecked />
          <FieldLabel htmlFor="col-type">Type</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="col-size" />
          <FieldLabel htmlFor="col-size">Size</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="col-modified" />
          <FieldLabel htmlFor="col-modified">Modified</FieldLabel>
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
// Figma .Checkbox variant set (checked × state) plus the indeterminate tri-state the code now
// styles. The focus rows force :focus-visible
// via the pseudo-states addon, so the focus ring — and the focus-gated invalid red
// ring (invalid alone shows only the destructive border) — is visible statically.
export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#s-focus', '#s-checked-focus', '#s-focus-invalid', '#s-checked-focus-invalid'] },
  },
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center gap-lg">
        <Checkbox id="s-default" />
        <Label htmlFor="s-default">Default (unchecked)</Label>
      </div>
      <div className="flex items-center gap-lg">
        <Checkbox id="s-focus" />
        <Label htmlFor="s-focus">Focus</Label>
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
        <Checkbox id="s-indeterminate" defaultChecked="indeterminate" />
        <Label htmlFor="s-indeterminate">Indeterminate</Label>
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
      <div className="flex items-center gap-lg">
        <Checkbox id="s-checked-focus-invalid" defaultChecked aria-invalid />
        <Label htmlFor="s-checked-focus-invalid">Checked + invalid + focus</Label>
      </div>
    </div>
  ),
};
