import type { ReactNode } from 'react';
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
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Shared state controls for the interactive previews (Default + ChoiceCard). checked /
// disabled / invalid are real props; hover / focus are CSS pseudo-states a plain boolean
// can't set, so PseudoWrap forces them via storybook-addon-pseudo-states' classes
// (pseudo-hover-all / pseudo-focus-visible-all simulate :hover / :focus-visible on every
// descendant — the addon rewrites the stylesheet on each render). This is the same
// mechanism the addon's toolbar uses, just bound to args so all states are togglable
// from the Controls panel. In default shadcn the checkbox has no hover style, so the
// hover toggle is a no-op today (kept for the Figma state axis + future hover).
type StateArgs = {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  hover: boolean;
  focus: boolean;
};

const stateArgTypes = {
  checked: { control: 'boolean' as const },
  disabled: { control: 'boolean' as const },
  invalid: { control: 'boolean' as const },
  hover: { control: 'boolean' as const },
  focus: { control: 'boolean' as const },
};

const stateControls = {
  controls: { include: ['checked', 'disabled', 'invalid', 'hover', 'focus'] },
};

function PseudoWrap({
  hover,
  focus,
  children,
}: {
  hover: boolean;
  focus: boolean;
  children: ReactNode;
}) {
  const className = [hover && 'pseudo-hover-all', focus && 'pseudo-focus-visible-all']
    .filter(Boolean)
    .join(' ');
  return <div className={className}>{children}</div>;
}

// Bare box — all interaction states as controls (checked / disabled / invalid props +
// hover / focus pseudo-states via PseudoWrap). invalid + focus shows the focus-gated
// destructive ring; invalid alone shows only the destructive border.
export const Default: StoryObj<StateArgs> = {
  parameters: stateControls,
  args: { checked: false, disabled: false, invalid: false, hover: false, focus: false },
  argTypes: stateArgTypes,
  render: ({ checked, disabled, invalid, hover, focus }) => (
    <PseudoWrap hover={hover} focus={focus}>
      <Checkbox
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
    </PseudoWrap>
  ),
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
// control trailing). All five interaction states are Controls (checked / disabled /
// invalid props + hover / focus pseudo-states via PseudoWrap), so every combination —
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
}: {
  id: string;
  checked: boolean;
  disabled: boolean;
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

export const ChoiceCard: StoryObj<StateArgs> = {
  parameters: stateControls,
  args: { checked: true, disabled: false, invalid: false, hover: false, focus: false },
  argTypes: stateArgTypes,
  render: ({ checked, disabled, invalid, hover, focus }) => (
    <PseudoWrap hover={hover} focus={focus}>
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
  { key: 'invalidfocus', label: 'Invalid + Focus', disabled: false, invalid: true, focus: true },
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
