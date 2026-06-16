import type { ComponentProps, ReactNode } from 'react';
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

type pseudoState = {
  focus: boolean;
  invalid: boolean;
};

const pseudoStateArgTypes = {
  invalid: { control: 'boolean' },
  focus: { control: 'boolean' },
} satisfies Record<keyof pseudoState, { control: 'boolean' }>;

// Usage examples mirror ui.shadcn.com/docs/components/radix/switch, which composes the
// switch with the ported Field family — label leads, switch trails (FieldLabel's
// flex-auto pushes the control to the right edge). Skipped: the "RTL" locale demo.
const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { checked: true, disabled: false, size: 'default' },
  // Curated prop docs for the Autodocs ArgsTable — react-docgen can't extract props from
  // `ComponentProps<typeof SwitchPrimitive.Root>` (a Radix type reference), so the public
  // API is documented here by hand. Interactive stories scope their panel via controls.include.
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled on/off state (pair with `onCheckedChange`).',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'On/off state when uncontrolled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onCheckedChange: {
      control: false,
      description: 'Called when the on/off state changes.',
      table: { type: { summary: '(checked: boolean) => void' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default'],
      description: 'DS size variant (track + thumb geometry).',
      table: { type: { summary: '"sm" | "default"' }, defaultValue: { summary: '"default"' } },
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
      description: 'Value submitted when on.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '"on"' } },
    },
  },
  parameters: {
    docs: { source: { type: 'code' } },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// focus is a CSS pseudo-state a plain boolean can't set, so PseudoWrap forces it via
// storybook-addon-pseudo-states (pseudo-focus-visible-all simulates :focus-visible on
// every descendant — the addon rewrites the stylesheet on each render).
function PseudoWrap({
  focus,
  children,
}: {
  focus: pseudoState['focus'];
  children: ReactNode;
}) {
  const className = focus ? 'pseudo-focus-visible-all' : '';
  return <div className={className}>{children}</div>;
}

// Bare switch — the API playground. Renders <Switch {...args} />, so every prop documented
// in the meta argTypes shows in the ArgsTable AND as a live control (no controls.include —
// that would also filter the table). The Field-composed examples + the pseudo-state preview
// live in the stories below.
export const Default: Story = {
  render: (args) => <Switch {...args} />,
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
// bordered card that tints when the switch is on (has-data-checked). All four interaction
// states are Controls (checked / disabled / invalid props + focus pseudo-state via
// PseudoWrap), so every combination — incl. invalid + focus — is reachable. DEFAULT shadcn:
// card reacts only to checked (tint) + disabled (dim); the switch carries focus (ring) +
// invalid (destructive track + focus-gated red ring).
function ChoiceCardCell({
  id,
  checked,
  disabled,
  invalid,
}: Pick<ComponentProps<typeof Switch>, 'checked' | 'disabled'> & {
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

export const ChoiceCard: StoryObj<ComponentProps<typeof Switch> & pseudoState> = {
  parameters: {
    controls: { include: ['checked', 'disabled', 'invalid', 'focus'] },
  },
  argTypes: pseudoStateArgTypes,
  args: { invalid: false, focus: false },
  render: ({ checked, disabled, invalid, focus }) => (
    <PseudoWrap focus={focus}>
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
// now shows the destructive track (per the Figma invalid member); the focus rows force
// :focus-visible via the pseudo-states addon, so the focus ring — and the focus-gated
// invalid red ring — is visible statically.
export const AllStates: Story = {
  parameters: {
    controls: { include: [] },
    pseudo: { focusVisible: ['#sw-checked-focus', '#sw-focus-invalid'] },
  },
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
        <Switch id="sw-checked-focus" defaultChecked />
        <span className="text-format-body text-muted-foreground">Checked + focus</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch disabled />
        <span className="text-format-body text-muted-foreground">Disabled</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch defaultChecked disabled />
        <span className="text-format-body text-muted-foreground">Checked + disabled</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-invalid />
        <span className="text-format-body text-muted-foreground">Invalid</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-invalid defaultChecked />
        <span className="text-format-body text-muted-foreground">Invalid (checked)</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch id="sw-focus-invalid" aria-invalid />
        <span className="text-format-body text-muted-foreground">Invalid + focus</span>
      </div>
    </div>
  ),
};
