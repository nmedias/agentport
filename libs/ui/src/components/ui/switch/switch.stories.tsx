import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './switch';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '../field';

// Usage examples mirror ui.shadcn.com/docs/components/radix/switch, which composes the
// switch with the ported Field family — label leads, switch trails (FieldLabel's
// flex-auto pushes the control to the right edge). Skipped: the "RTL" locale demo.
const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Shared state controls for the interactive previews (Default + ChoiceCard) — same as the
// Checkbox stories. checked / disabled / invalid are real props; hover / focus are CSS
// pseudo-states a plain boolean can't set, so PseudoWrap forces them via
// storybook-addon-pseudo-states (pseudo-hover-all / pseudo-focus-visible-all simulate
// :hover / :focus-visible on every descendant — the addon rewrites the stylesheet on each
// render). In default shadcn the switch has no hover style, so the hover toggle is a no-op
// today (kept for the Figma state axis + future hover).
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

// Bare switch — all interaction states as controls (checked / disabled / invalid props +
// hover / focus pseudo-states via PseudoWrap). invalid + focus shows the focus-gated
// destructive ring; invalid alone shows the destructive track + border, no ring. (Size
// variants live in the Sizes story.)
export const Default: StoryObj<StateArgs> = {
  parameters: stateControls,
  args: { checked: false, disabled: false, invalid: false, hover: false, focus: false },
  argTypes: stateArgTypes,
  render: ({ checked, disabled, invalid, hover, focus }) => (
    <PseudoWrap hover={hover} focus={focus}>
      <Switch
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
    </PseudoWrap>
  ),
};

// docs "Airplane Mode" (basic): a labeled switch in a horizontal Field.
export const AirplaneMode: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldLabel htmlFor="airplane-mode">Airplane Mode</FieldLabel>
      <Switch id="airplane-mode" />
    </Field>
  ),
};

// docs "Description": label + helper text on the left, switch on the right.
export const Description: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="marketing">Marketing emails</FieldLabel>
          <FieldDescription>
            Receive emails about new products, features, and more.
          </FieldDescription>
        </FieldContent>
        <Switch id="marketing" />
      </Field>
    </FieldGroup>
  ),
};

// Choice Card — interactive state preview. FieldLabel wraps the whole Field → a clickable,
// bordered card that tints when the switch is on (has-data-checked). All five interaction
// states are Controls (checked / disabled / invalid props + hover / focus pseudo-states via
// PseudoWrap), so every combination — incl. invalid + focus — is reachable. DEFAULT shadcn:
// card reacts only to checked (tint) + disabled (dim); the switch carries focus (ring) +
// invalid (destructive track + focus-gated red ring).
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
          <FieldTitle>Share across devices</FieldTitle>
          <FieldDescription>
            Focus is shared across devices and turns off when you leave.
          </FieldDescription>
          {invalid && (
            <FieldError>Turn this on to sync across your devices.</FieldError>
          )}
        </FieldContent>
        <Switch
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
        id="cc-share"
        checked={checked}
        disabled={disabled}
        invalid={invalid}
      />
    </PseudoWrap>
  ),
};

// At-a-glance gallery, columns = off vs on. The Focus rows force :focus-visible on the
// switch via the pseudo-states addon, so the focus ring — and the focus-gated invalid red
// ring (invalid alone shows the destructive track + border) — is visible statically.
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
    // force :focus-visible on the focus rows' switches (storybook-addon-pseudo-states)
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
        <span className="text-format-eyebrow text-muted-foreground">Off</span>
        <span className="text-format-eyebrow text-muted-foreground">On</span>
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

// docs "Size": both size variants, each labeled, in a FieldGroup.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="size-sm">Small</FieldLabel>
        <Switch id="size-sm" size="sm" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="size-default">Default</FieldLabel>
        <Switch id="size-default" size="default" defaultChecked />
      </Field>
    </FieldGroup>
  ),
};

// docs "Disabled": disabled prop on the Switch + data-disabled on the Field.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" data-disabled="true" className="max-w-sm">
      <FieldLabel htmlFor="disabled-switch">Airplane Mode</FieldLabel>
      <Switch id="disabled-switch" disabled />
    </Field>
  ),
};

// docs "Invalid": aria-invalid on the Switch (destructive track) + data-invalid on
// the Field + FieldError.
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" data-invalid className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="two-factor">Two-factor authentication</FieldLabel>
        <FieldError>Two-factor authentication is required for this account.</FieldError>
      </FieldContent>
      <Switch id="two-factor" aria-invalid />
    </Field>
  ),
};

// DS-authored gallery: the state matrix (maps the Figma .Switch variant set). Invalid
// now shows the destructive track (per the Figma invalid member); focus is live.
export const AllStates: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center gap-md">
        <Switch />
        <span className="text-format-body text-muted-foreground">Unchecked</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch defaultChecked />
        <span className="text-format-body text-muted-foreground">Checked</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch disabled />
        <span className="text-format-body text-muted-foreground">Disabled</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-invalid />
        <span className="text-format-body text-muted-foreground">Invalid</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-invalid defaultChecked />
        <span className="text-format-body text-muted-foreground">Invalid (checked)</span>
      </div>
    </div>
  ),
};
