import type {ComponentProps, ReactNode} from 'react';
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
  FieldTitle,
} from '../field';

type pseudoState =  {
  focus: boolean;
  invalid: boolean;
};

const pseudoStateArgTypes = {
  invalid: { control: 'boolean' },
  focus:   { control: 'boolean' },
} satisfies Record<keyof  pseudoState, { control: 'boolean' }>;

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

// Shared state controls for the interactive previews (Default + ChoiceCard). checked /
// disabled / invalid are real props; focus is a CSS pseudo-state a plain boolean can't
// set, so PseudoWrap forces it via storybook-addon-pseudo-states' class
// (pseudo-focus-visible-all simulates :focus-visible on every descendant — the addon
// rewrites the stylesheet on each render). This is the same mechanism the addon's toolbar
// uses, just bound to an arg so focus is togglable from the Controls panel.

function PseudoWrap({
  focus,
  children,
}: {
  focus: pseudoState["focus"];
  children: ReactNode;
}) {
  const className = focus ? 'pseudo-focus-visible-all' : '';
  return <div className={className}>{children}</div>;
}

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

// Choice Card — interactive state preview. The radix checkbox docs ship no choice card;
// this mirrors the Switch/RadioGroup choice cards (same FieldLabel-wraps-Field branch,
// control trailing). All four interaction states are Controls (checked / disabled /
// invalid props + focus pseudo-state via PseudoWrap), so every combination —
// including invalid + focus — is reachable from the panel.
//
// DEFAULT shadcn, NOT a custom design: at the CARD level only checked (→ primary tint)
// and disabled (→ opacity-50) react; default shadcn adds NO card hover, and "selected"
// is just checked=true. The CONTROL carries focus (ring) + invalid. The invalid ring is
// FOCUS-GATED (checkbox.tsx, aligned with .Input): invalid alone = destructive border,
// invalid + focus = + transparent red ring. Copy from shadcn's new-york-v4 demo.
function ChoiceCardCell({
  id,
  checked,
  disabled,
  invalid,
}: Pick<ComponentProps<typeof Checkbox>, 'checked' | 'disabled'> & {
  id: string;
  invalid: boolean;
}) {
  return (
    <FieldLabel
      htmlFor={id}
      className="max-w-sm"
      data-disabled={disabled ? 'true' : undefined}
    >
      <Field
        orientation="horizontal"
        data-disabled={disabled ? 'true' : undefined}
        data-invalid={invalid || undefined}
      >
        <FieldContent>
          <FieldTitle>Enable notifications</FieldTitle>
          <FieldDescription>
            You can enable or disable notifications at any time.
          </FieldDescription>
          {invalid && (
            <FieldError>You must enable notifications to continue.</FieldError>
          )}
        </FieldContent>
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          aria-invalid={invalid || undefined}
        />
      </Field>
    </FieldLabel>
  );
}


export const ChoiceCard: StoryObj<ComponentProps<typeof Checkbox> & pseudoState> = {
  parameters: {
    controls: { include: ['checked', 'disabled', 'invalid', 'focus'] },
  },
  argTypes: pseudoStateArgTypes,
  args: {
    invalid: false,
    focus: false
  },
  render: ({ checked, disabled, invalid, focus }) => (
    <PseudoWrap focus={focus}>
      <ChoiceCardCell
        id="cc-notifications"
        checked={checked}
        disabled={disabled}
        invalid={invalid}
      />
    </PseudoWrap>
  ),
};

// At-a-glance gallery, columns = unchecked vs checked. The two Focus rows force
// :focus-visible on their checkbox via the pseudo-states addon, so the focus ring — and
// the focus-gated invalid red ring (invalid alone shows only the destructive border) —
// is visible statically. hover is omitted: default shadcn adds none to the card/control.
const STATE_ROWS = [
  { key: 'enabled', label: 'Enabled', disabled: false, invalid: false, focus: false },
  { key: 'focus', label: 'Focus', disabled: false, invalid: false, focus: true },
  { key: 'disabled', label: 'Disabled', disabled: true, invalid: false, focus: false },
  { key: 'invalid', label: 'Invalid', disabled: false, invalid: true, focus: false },
  { key: 'invalid-focus', label: 'Invalid + Focus', disabled: false, invalid: true, focus: true },
];

export const ChoiceCardStates: Story = {
  parameters: {
    controls: { disable: true },
    // force :focus-visible on the focus rows' checkboxes (storybook-addon-pseudo-states)
    pseudo: {
      focusVisible: STATE_ROWS.filter((r) => r.focus).flatMap((r) => [
        `#cc-${r.key}-off`,
        `#cc-${r.key}-on`,
      ]),
    },
  },
  render: () => (
    <div className="flex max-w-2xl flex-col gap-xl">
      <div className="grid grid-cols-[7rem_1fr_1fr] items-center gap-lg">
        <span />
        <span className="text-format-eyebrow text-muted-foreground">Unchecked</span>
        <span className="text-format-eyebrow text-muted-foreground">Checked</span>
      </div>
      {STATE_ROWS.map((r) => (
        <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-start gap-lg">
          <span className="pt-md text-format-eyebrow text-muted-foreground">
            {r.label}
          </span>
          <ChoiceCardCell
            id={`cc-${r.key}-off`}
            checked={false}
            disabled={r.disabled}
            invalid={r.invalid}
          />
          <ChoiceCardCell
            id={`cc-${r.key}-on`}
            checked
            disabled={r.disabled}
            invalid={r.invalid}
          />
        </div>
      ))}
    </div>
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
